import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import CreateCourseModal from "../Components/CreateCourseModal.jsx";
import CreateProjectModal from "../Components/CreateProjectModal.jsx";
import EditCourseModal from "../Components/EditCourseModal.jsx";
import EditProjectModal from "../Components/EditProjectModal.jsx";
import AnalyticsDashboard from "../Components/AnalyticDashboard.jsx";

export default function AdminPanel() {
  const { getToken } = useAuth();

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [badges, setBadges] = useState([]);

  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const [cRes, pRes, bRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses/admin`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects/admin`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/admin/badges/allocations`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);
        setCourses(cRes.data.courses || cRes.data);
        setProjects(pRes.data.projects || pRes.data);
        setBadges(bRes.data.badges || []);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken]);

  return (
    <div className="px-4 sm:px-6 md:px-16 lg:px-16 py-8 sm:py-12 md:py-16 bg-background space-y-8">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 py-4">
        <button
          onClick={() => setShowCourseModal(true)}
          className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white rounded-lg shadow transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Course
        </button>
        <button
          onClick={() => setShowProjectModal(true)}
          className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white rounded-lg shadow transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Project
        </button>
      </div>

      {/* Data Tables */}
      {loading ? (
        <p className="text-center py-12">Loading admin data…</p>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
            {/* Courses Management */}
            <section className="bg-white w-full lg:w-1/3 rounded-xl p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl text-primary py-4 font-semibold mb-4">
                All Courses
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Category</th>
                      <th className="px-4 py-2 text-center">Sections</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {courses.map((course, idx) => (
                      <tr
                        key={course._id}
                        className={`${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-purple-50 hover:shadow-sm transition`}
                      >
                        {/* Course + Thumbnail */}
                        <td className="px-4 py-3 flex items-center space-x-3">
                          {course.thumbnail && (
                            <img
                              src={course.thumbnail}
                              alt=""
                              className="h-8 w-8 rounded-md object-cover border"
                            />
                          )}
                          <span className="font-medium text-gray-900">
                            {course.title}
                          </span>
                        </td>

                        {/* Category Pill */}
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold uppercase rounded-2xl">
                            {course.category || "General"}
                          </span>
                        </td>

                        {/* Sections Badge */}
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            {course.sections?.length || 0}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedCourse(course)}
                            className="inline-flex items-center p-1 text-indigo-600 hover:text-indigo-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path d="M4 16h12v2H4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Projects Management */}
            <section className="bg-white w-full lg:w-1/3 rounded-xl p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl text-primary py-4 font-semibold mb-4">
                All Projects
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Deadline</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projects.map((proj, idx) => (
                      <tr
                        key={proj._id}
                        className={`${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-green-50 hover:shadow-sm transition`}
                      >
                        {/* Project Title */}
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {proj.title}
                        </td>

                        {/* Status Pill */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              proj.status === "Pending"
                                ? "bg-purple-100 text-purple-800"
                                : proj.status === "In Progress"
                                ? "bg-gray-100 text-gray-800"
                                : proj.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }`}
                          >
                            {proj.status}
                          </span>
                        </td>

                        {/* Deadline */}
                        <td className="px-4 py-3 text-gray-600">
                          <time dateTime={proj.deadline}>
                            {new Date(proj.deadline).toLocaleDateString()}
                          </time>
                        </td>

                        {/* Actions: Edit Button */}
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedProject(proj)}
                            className="inline-flex items-center p-1 text-green-600 hover:text-green-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path d="M4 16h12v2H4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Badge Allocation */}
            <section className="bg-white w-full lg:w-1/3 rounded-xl p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl text-primary py-4 font-semibold mb-4">
                Badge Allocation
              </h2>
              {badges.length === 0 ? (
                <p className="text-gray-500">No badges have been awarded yet.</p>
              ) : (
                <ul className="space-y-4">
                  {badges.map((b) => (
                    <li
                      key={b.id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{b.name}</p>
                        <p className="text-sm text-gray-500">{b.description}</p>
                      </div>
                      <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        {b.count} awarded
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Analytics Dashboard */}
          <AnalyticsDashboard />
        </>
      )}

      {/* Create Modals */}
      <CreateCourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
      />
      <CreateProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />

      {/* Edit Modals */}
      {selectedCourse && (
        <EditCourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onSaved={(updated) => {
            setCourses((list) =>
              list.map((c) => (c._id === updated._id ? updated : c))
            );
            setSelectedCourse(null);
          }}
        />
      )}

      {selectedProject && (
        <EditProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSaved={(updated) => {
            setProjects((list) =>
              list.map((p) => (p._id === updated._id ? updated : p))
            );
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
}
