import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';

const CoursePage = () => {
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [checkedChapters, setCheckedChapters] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  // modal state
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [pendingChapterIdx, setPendingChapterIdx] = useState(null);

  const { id } = useParams();
  const { getToken } = useAuth();

  // fetch course + user’s completedSections & progress
  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/courses/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const cd = data.course;
        setCourse(cd);
        setChapters(cd.sections || []);
        setIsEnrolled(!!data.already);
        setCheckedChapters(data.completedSections || []);
        setProgress(data.progress || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourse();
  }, [id, getToken]);

  // handle course completion
  const handleComplete = async () => {
    try {
      const token = await getToken();
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/courses/${course._id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Course marked complete! Badge awarded 🎉');
    } catch (err) {
      console.error(err);
      toast.error('Failed to complete course');
    }
  };

  // enroll API call
  const handleEnroll = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/courses/${id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEnrolled(true);
    } catch (err) {
      console.error("Enroll failed", err);
    }
  };

  // toggle a section via backend
  const handleToggleSection = async (idx) => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/courses/${id}/sections/${idx}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCheckedChapters(data.completedSections);
      setProgress(data.progress);
    } catch (err) {
      console.error("Toggle section error:", err);
    }
  };

  // when user clicks a checkbox
  const onCheckboxClick = (idx) => {
    if (isEnrolled) {
      handleToggleSection(idx);
    } else {
      setPendingChapterIdx(idx);
      setShowEnrollModal(true);
    }
  };

  const onConfirmEnroll = async () => {
    await handleEnroll();
    await handleToggleSection(pendingChapterIdx);
    setShowEnrollModal(false);
    setPendingChapterIdx(null);
  };

  const onCancelEnroll = () => {
    setShowEnrollModal(false);
    setPendingChapterIdx(null);
  };

  if (!course) return <p className="p-4 text-center">Loading course…</p>;

  return (
    <div className="bg-background rounded-lg px-4 sm:px-8 lg:px-11 py-4 mt-8 sm:mt-12 md:mt-16 max-w-full mx-auto">
      {/* Course Title */}
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold py-4 sm:py-5 mb-3 text-gray-800 text-left">
        {course.title}
      </h3>

      {/* Thumbnail Image */}
      <div className="flex justify-center mb-6 px-4 sm:px-8 md:px-12">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full max-h-[50vh] sm:max-h-[60vh] md:max-h-[65vh] rounded-lg object-cover"
        />
      </div>

      {/* Course Overview */}
      <div className="px-4 sm:px-8 md:px-11 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
            <h4 className="text-xl sm:text-2xl md:text-3xl text-primary font-semibold flex-1 mb-2 md:mb-0">
              Course Overview
            </h4>
            <div className="flex flex-wrap space-x-2">
              {/* Category Pill */}
              <span className="text-xs sm:text-sm bg-primary text-white px-2 sm:px-3 py-1 rounded-full">
                {course.category}
              </span>
              {/* Duration Pill */}
              <span className="flex items-center text-xs sm:text-sm bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6l4 2M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>
                <span className="ml-1">
                  {Math.floor(course.duration)}h&nbsp;
                  {Math.round((course.duration % 1) * 60)}m
                </span>
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
            {course.description}
          </p>

          {course.skillTags && course.skillTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.skillTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chapters & Progress */}
      <div className="bg-background py-6 px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-8xl mx-auto flex flex-col-reverse md:flex-row gap-6">
          {/* Left: Chapter List */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-4 sm:p-6">
            {chapters.map((chapter, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 border rounded-lg p-3 sm:p-4 hover:shadow-sm transition"
              >
                {/* Left: checkbox + title */}
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={checkedChapters.includes(idx)}
                    onChange={() => onCheckboxClick(idx)}
                    className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {chapter.title}
                  </span>
                </div>

                {/* Right: duration + resources button */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {chapter.duration} min
                  </span>
                  {isEnrolled && (
                    <button
                      onClick={() =>
                        window.open(chapter.link, "_blank", "noopener")
                      }
                      className="text-purple-600 border border-purple-400 px-2 py-1 rounded text-xs hover:bg-purple-50 transition"
                    >
                      Resources
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              className="mt-4 sm:mt-6 mb-4 sm:mb-8 w-full sm:w-auto flex justify-center px-2 sm:px-4 bg-primary text-white py-2 sm:py-3 rounded hover:bg-purple-700 transition disabled:opacity-50"
              onClick={handleComplete}
              disabled={checkedChapters.length < chapters.length}
            >
              Claim Reward
            </button>
          </div>

          {/* Right: Progress Circle */}
          <div className="w-full md:w-1/3 flex flex-col py-4 sm:py-8 items-center bg-white rounded-lg shadow-sm">
            <h4 className="text-base sm:text-lg font-semibold mb-4">
              Progress Report
            </h4>
            <svg viewBox="0 0 160 160" className="w-32 h-32 sm:w-40 sm:h-40">
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="transparent"
                stroke="#E9D8FD"
                strokeWidth="20"
              />
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="transparent"
                stroke="#7C3AED"
                strokeWidth="20"
                strokeDasharray="376.8"
                strokeDashoffset={376.8 - (376.8 * progress) / 100}
                transform="rotate(-90 80 80)"
                strokeLinecap="round"
              />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="18"
                fill="#4C1D95"
              >
                {progress}%
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Enroll Confirmation Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 max-w-xs sm:max-w-sm w-full">
            <h4 className="text-base sm:text-lg font-semibold mb-4">
              Enroll Required
            </h4>
            <p className="text-sm sm:text-base mb-6">
              You need to enroll in this course to mark chapters complete.
              Enroll now?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancelEnroll}
                className="px-3 sm:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmEnroll}
                className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm sm:text-base"
              >
                Enroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
