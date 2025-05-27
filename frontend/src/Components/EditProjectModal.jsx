// src/components/EditProjectModal.jsx
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";

export default function EditProjectModal({ project, onClose, onSaved }) {
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
      title:          project.title,
      description:    project.description || "",
      requiredSkills: (project.requiredSkills || []).join(","),
      status:         project.status,
      assignedTo:     project.assignedTo?.map(id => id.toString()) || [],
      deadline:       project.deadline
                        ? new Date(project.deadline).toISOString().slice(0,10)
                        : "",
      resources:      (project.resources || []).map(r => ({
        title:  r.title,
        link:   r.link,
        topics: (r.topics || []).join(",")
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "resources"
  });

  const [users, setUsers]         = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [uploading, setUploading] = useState(false);

  // load users for assignment
  useEffect(() => {
    if (!project) return;
    (async () => {
      setLoadingUsers(true);
      try {
        const token = await getToken();
        const resp = await axios.get(
         `${process.env.REACT_APP_BACKEND_URL}/api/auth/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(resp.data);
      } catch (err) {
        console.error("Could not load users:", err);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, [project, getToken]);

  // upload helper (same as course)
  const uploadToCloudinary = async file => {
    const formData = new FormData();
    formData.append("file", file);
    const token = await getToken();
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/courses/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return data.url;
  };

  // handle resource file
  const onFileChange = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue(`resources.${idx}.link`, url, { shouldTouch: true });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async values => {
    try {
      const token = await getToken();
      const payload = {
        title:          values.title,
        description:    values.description,
        requiredSkills: values.requiredSkills
                          .split(",")
                          .map(s => s.trim())
                          .filter(Boolean),
        status:         values.status,
        assignedTo:     values.assignedTo,            // string[] of user IDs
        deadline:       values.deadline,              // "YYYY-MM-DD"
        resources:      values.resources.map(r => ({
          title:  r.title,
          link:   r.link,
          topics: r.topics
                    .split(",")
                    .map(t => t.trim())
                    .filter(Boolean)
        }))
      };

      const { data } = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects/${project._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Project updated");
      onSaved(data.project);
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project");
    }
  };

  if (!project) return null;

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hide-scrollbar">
      <div onClick={e => e.stopPropagation()} className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-auto max-h-[90vh] hide-scrollbar">
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
          <h2 className="text-2xl font-semibold mb-4">Edit Project</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title, Status, Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="font-medium">Title</span>
                <input
                  {...register("title", { required: true })}
                  className="border rounded p-2"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium">Status</span>
                <select
                  {...register("status")}
                  className="border rounded p-2"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </label>
              <label className="flex flex-col md:col-span-2">
                <span className="font-medium">Description</span>
                <textarea
                  {...register("description")}
                  className="border rounded p-2 h-24"
                />
              </label>
            </div>

            {/* Skills & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="font-medium">Required Skills</span>
                <input
                  {...register("requiredSkills")}
                  placeholder="HTML,CSS,React"
                  className="border rounded p-2"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium">Deadline</span>
                <input
                  type="date"
                  {...register("deadline", { required: true })}
                  className="border rounded p-2"
                />
              </label>
            </div>

            {/* Assign To */}
            <div>
              <span className="font-medium">Assign To</span>
              {loadingUsers ? (
                <p>Loading users…</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                  {users.map(u => (
                    <label key={u._id} className="flex items-center">
                      <input
                        type="checkbox"
                        value={u._id}
                        {...register("assignedTo")}
                        className="mr-2"
                      />
                      <span>{u.name} <span className="text-gray-500">({u.email})</span></span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Resources</h3>
              <div className="space-y-4">
                {fields.map((field, idx) => (
                  <div key={field.id} className="border rounded p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Resource {idx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <label className="flex flex-col">
                      <span>Title</span>
                      <input
                        {...register(`resources.${idx}.title`, { required: true })}
                        className="border rounded p-2"
                      />
                    </label>

                    <label className="flex flex-col">
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="*/*"
                        onChange={e => onFileChange(e, idx)}
                        className="border rounded p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                      />
                    </label>

                    {uploading && <p>Uploading…</p>}
                    {watch(`resources.${idx}.link`) && (
                      <a
                        href={watch(`resources.${idx}.link`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View uploaded
                      </a>
                    )}

                    <label className="flex flex-col">
                      <span>Topics (comma-separated)</span>
                      <input
                        {...register(`resources.${idx}.topics`)}
                        placeholder="Setup,Usage,Troubleshoot"
                        className="border rounded p-2"
                      />
                    </label>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => append({ title: "", link: "", topics: "" })}
                className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-purple-700"
              >
                + Add Resource
              </button>
            </div>

            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
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