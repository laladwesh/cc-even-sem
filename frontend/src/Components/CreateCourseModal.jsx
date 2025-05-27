// src/components/CreateCourseModal.jsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { createPortal } from 'react-dom';

export default function CreateCourseModal({ isOpen, onClose, onSuccess }) {
  const { getToken } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      thumbnail: '',
      title: '',
      description: '',
      category: '',
      skillTags: '',
      duration: '',
      chapters: [{ title: '', duration: '', link: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chapters',
  });

  const [uploading, setUploading] = useState(false);
  const thumbnailUrl = watch('thumbnail');

  // helper to upload any file
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = await getToken();
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/courses/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.url;
  };

  // thumbnail handler
  const onThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue('thumbnail', url, { shouldDirty: true });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // chapter file handler
  const onFileChange = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue(`chapters.${idx}.link`, url, {
        shouldDirty: true,
        shouldTouch: true,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // form submit
  const onSubmit = async (values) => {
    const token = await getToken();
    const skillTags = values.skillTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      thumbnail: values.thumbnail,
      title: values.title,
      description: values.description,
      category: values.category,
      skillTags,
      duration: parseFloat(values.duration),
      sections: values.chapters.map((c) => ({
        title: c.title,
        duration: parseFloat(c.duration),
        link: c.link,
      })),
    };

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/courses`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      reset();
      toast.success('Course created successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create course. Please try again.');
    }
  };

  if (!isOpen) return null;
  return createPortal(
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div onClick={e => e.stopPropagation()} className="bg-white py-16 px-16 w-full max-w-3xl p-6 rounded shadow-lg relative max-h-[84vh] overflow-auto hide-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-3xl text-primary font-semibold mb-4">Add New Course</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Thumbnail */}
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
                className="h-16 w-16 object-cover rounded"
              />
            )}
          </div>

          {/* Course fields */}
          <div className="grid grid-cols-2 gap-4">
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
            <label className="flex flex-col col-span-2">
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
              <span className="font-medium">
                Duration (hours, e.g. 1.5)
              </span>
              <input
                {...register('duration', { valueAsNumber: true })}
                type="number"
                step="0.1"
                className="border rounded p-2"
              />
            </label>
          </div>

          {/* Chapters */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Chapters</h3>
            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="border rounded p-4 space-y-3"
                >
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
                        {...register(`chapters.${idx}.title`, {
                          required: true,
                        })}
                        className="border rounded p-2"
                      />
                    </label>
                    <label className="flex flex-col">
                      <span>Duration (min)</span>
                      <input
                        {...register(`chapters.${idx}.duration`, {
                          valueAsNumber: true,
                        })}
                        type="number"
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
                    {getValues(`chapters.${idx}.link`) && (
                      <a
                        href={getValues(`chapters.${idx}.link`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 underline text-sm"
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
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-purple-700"
            >
              + Add Chapter
            </button>
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-primary text-white rounded hover:bg-purple-700 w-full"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
