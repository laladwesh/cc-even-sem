// src/components/EditCourseModal.jsx
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';

export default function EditCourseModal({ course, onClose, onSaved }) {
  const { getToken } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      thumbnail:   course.thumbnail || '',
      title:       course.title,
      description: course.description || '',
      category:    course.category || '',
      skillTags:   (course.skillTags || []).join(','),
      duration:    course.duration || 1,
      chapters:    (course.sections || []).map(s => ({
        title:    s.title,
        duration: s.duration,
        link:     s.link
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chapters'
  });

  const [uploading, setUploading]   = useState(false);
  const thumbnailUrl = watch('thumbnail');

  // Cloudinary upload helper
  const uploadToCloudinary = async file => {
    const formData = new FormData();
    formData.append('file', file);
    const token = await getToken();
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/courses/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    );
    return data.url;
  };

  // handle thumbnail change
  const onThumbnailChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue('thumbnail', url, { shouldDirty: true });
    } catch (err) {
      console.error(err);
      toast.error('Thumbnail upload failed');
    } finally {
      setUploading(false);
    }
  };

  // handle chapter file upload
  const onFileChange = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue(`chapters.${idx}.link`, url, { shouldDirty: true });
    } catch (err) {
      console.error(err);
      toast.error('Resource upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async values => {
    try {
      const token = await getToken();
      const payload = {
        thumbnail: values.thumbnail,
        title:     values.title,
        description: values.description,
        category:  values.category,
        skillTags: values.skillTags.split(',').map(t => t.trim()).filter(Boolean),
        duration:  parseFloat(values.duration),
        sections:  values.chapters.map(c => ({
          title:    c.title,
          duration: parseFloat(c.duration),
          link:     c.link
        }))
      };

      const { data } = await axios.patch(
       `${process.env.REACT_APP_BACKEND_URL}/api/courses/${course._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Course updated');
      onSaved(data.course);
      reset();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update course');
    }
  };

  if (!course) return null;

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div onClick={e => e.stopPropagation()} className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-auto max-h-[90vh] hide-scrollbar">
        <div className="p-16 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
          <h2 className="text-2xl font-semibold mb-4">Edit Course</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Thumbnail upload */}
            <div className="flex items-center space-x-4">
              <label className="flex flex-col">
                <span className="font-medium">Thumbnail</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onThumbnailChange}
                  className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                />
              </label>
              {uploading && <span>Uploading…</span>}
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  className="h-16 w-16 rounded object-cover"
                />
              )}
            </div>

            {/* Course fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="font-medium">Title</span>
                <input
                  {...register('title', { required: true })}
                  className="border rounded p-2"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium">Category</span>
                <input
                  {...register('category')}
                  className="border rounded p-2"
                />
              </label>
              <label className="flex flex-col md:col-span-2">
                <span className="font-medium">Description</span>
                <textarea
                  {...register('description')}
                  className="border rounded p-2 h-24"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium">
                  Skill Tags (comma separated)
                </span>
                <input
                  {...register('skillTags')}
                  className="border rounded p-2"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium">Duration (hours)</span>
                <input
                  type="number"
                  step="0.1"
                  {...register('duration', { valueAsNumber: true })}
                  className="border rounded p-2"
                />
              </label>
            </div>

            {/* Chapters */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Chapters</h3>
              <div className="space-y-4">
                {fields.map((field, idx) => (
                  <div key={field.id} className="border rounded p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Chapter {idx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex flex-col col-span-2">
                        <span>Title</span>
                        <input
                          {...register(`chapters.${idx}.title`, { required: true })}
                          className="border rounded p-2"
                        />
                      </label>
                      <label className="flex flex-col">
                        <span>Duration (min)</span>
                        <input
                          type="number"
                          {...register(`chapters.${idx}.duration`, { valueAsNumber: true })}
                          className="border rounded p-2"
                        />
                      </label>
                    </div>

                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        onChange={(e) => onFileChange(e, idx)}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                      />
                      {uploading && <span>Uploading…</span>}
                      {watch(`chapters.${idx}.link`) && (
                        <a
                          href={watch(`chapters.${idx}.link`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          View uploaded
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => append({ title: '', duration: '', link: '' })}
                className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-purple-700"
              >
                + Add Chapter
              </button>
            </div>

            <button
              type="submit"
              className="mt-6 w-full px-6 py-3 bg-primary text-white rounded hover:bg-purple-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
