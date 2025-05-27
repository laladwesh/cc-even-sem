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
  const [progress, setProgress] = useState(0); // only declaration of progress

  // modal state
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [pendingChapterIdx, setPendingChapterIdx] = useState(null);

  const { id } = useParams();
  const { getToken } = useAuth();
  // const navigate = useNavigate();

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
        console.log("Course data:", data);
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
        {}, // no body needed
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Course marked complete! Badge awarded 🎉');
      // you can also refresh local state here…
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

  if (!course) return <p>Loading course…</p>;

  return (
    <div className="bg-background rounded-lg px-11 py-4 mt-20 max-w-full">
      <h3 className="text-4xl font-semibold py-5 mb-3 text-gray-800">
        {course.title}
      </h3>
      <div className="flex justify-center mb-6">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full px-12 max-h-[65vh] rounded-lg object-cover"
        />
      </div>
      <div className="px-11">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <h4 className="text-3xl text-primary font-semibold flex-1">
              Course Overview
            </h4>
            <div className="flex space-x-2">
              {/* Category Pill */}
              <span className="text-sm bg-primary text-white px-3 py-1 rounded-full">
                {course.category}
              </span>
              {/* Duration Pill */}
              <span className="flex items-center text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
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
                  {Math.floor(course.duration)}h{" "}
                  {Math.round((course.duration % 1) * 60)}m
                </span>
              </span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            {course.description}
          </p>

          {course.skillTags && course.skillTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.skillTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-background min-h-screen p-6 flex justify-center">
        <div className="p-6 rounded-lg w-full max-w-8xl flex gap-6">
          {/* Left: Chapter List */}
          <div className="flex-1 bg-white h-auto">
            {chapters.map((chapter, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between mb-4 border rounded-lg p-4 hover:shadow-sm transition"
              >
                {/* Left: checkbox + title */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={checkedChapters.includes(idx)}
                    onChange={() => onCheckboxClick(idx)}
                    className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-800 font-medium">
                    {chapter.title}
                  </span>
                </div>

                {/* Right: duration + resources button */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
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
              className="mt-6 mb-8 flex justify-center px-2 mx-auto bg-primary text-white py-2 rounded hover:bg-purple-700"
              onClick={handleComplete}
              disabled={checkedChapters.length < chapters.length}
            >
              Claim Reward
            </button>
          </div>

          {/* Right: Progress Circle */}
          <div className="w-1/3 flex flex-col py-8 items-center">
            <h4 className="font-semibold mb-4">Progress Report</h4>
            <svg className="w-40 h-40">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h4 className="text-lg font-semibold mb-4">Enroll Required</h4>
            <p className="mb-6">
              You need to enroll in this course to mark chapters complete.
              Enroll now?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancelEnroll}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmEnroll}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
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
