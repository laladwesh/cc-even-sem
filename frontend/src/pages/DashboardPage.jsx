import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

const DashboardPage = () => {
  const [courses, setCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("Available Courses");

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Not Started":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  // 1) Keep Clerk & your backend in sync
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await getToken();
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/sync`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to sync Clerk user:", err);
      }
    })();
  }, [user, getToken]);

  // 2) Load courses + user, then merge progress/status
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // API shape: { courses: Course[], user: UserWithEnrolledAndFav }
        const fetchedCourses = res.data.courses;
        const fetchedUser = res.data.user;

        // Build a map: courseId → progress
        const progressMap = new Map(
          (fetchedUser.enrolledCourses || []).map((e) => [
            String(e.courseId ?? e._id),
            e.progress,
          ])
        );

        // Annotate each course
        const withProgress = fetchedCourses.map((course) => {
          const isEnrolled = progressMap.has(course._id);
          const progress = progressMap.get(course._id) ?? 0;
          const status = !isEnrolled
            ? "Not Started"
            : progress === 100
            ? "Completed"
            : "In Progress";
          return { ...course, isEnrolled, progress, status };
        });

        setCourses(withProgress);
        setUserData(fetchedUser);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    })();
  }, [user, getToken]);

  // Loading state
  if (!userData) {
    return (
      <p className="p-4 text-center text-gray-600 text-base">Loading…</p>
    );
  }

  // Helpers for tabs
  const enrolledIds = new Set(
    userData.enrolledCourses.map((c) => String(c.courseId ?? c._id))
  );
  const favIds = new Set(
    userData.favouriteCourses.map((c) => String(c.courseId))
  );

  const tabs = {
    "My Courses": courses.filter((c) => enrolledIds.has(c._id)),
    "Favorite Courses": courses.filter((c) => favIds.has(c._id)),
    "Available Courses": courses,
  };

  // Fav toggle & enroll handlers (unchanged)
  const handleToggleFav = async (courseId) => {
    const isFav = favIds.has(courseId);
    try {
      const token = await getToken();
      if (!isFav) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/courses/${courseId}/enroll/fav`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData((d) => ({
          ...d,
          favouriteCourses: [...d.favouriteCourses, { courseId }],
        }));
      } else {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/courses/${courseId}/rm/fav`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData((d) => ({
          ...d,
          favouriteCourses: d.favouriteCourses.filter(
            (fc) => String(fc.courseId) !== courseId
          ),
        }));
      }
    } catch (err) {
      console.error("Favourite toggle failed", err);
    }
  };
  const handleEnroll = async (courseId) => {
    try {
      const token = await getToken();
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((d) => ({
        ...d,
        enrolledCourses: [...d.enrolledCourses, { courseId, progress: 0 }],
      }));
    } catch (err) {
      console.error("Enroll failed", err);
    }
  };

  return (
    <div className="bg-[#e7d9f9] w-full px-4 sm:px-6 lg:px-36 py-24">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold mb-4">
        Training Dashboard
      </h2>

      {/* Tabs */}
      <div className="flex space-x-3 mb-8">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === tab
                ? "bg-white shadow"
                : "bg-purple-100 hover:bg-purple-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tabs[activeTab].map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden"
          >
            <img
              src={course.thumbnail || course.image}
              alt={course.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              {/* Title + Status */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">
                  {course.title}
                </h3>
                <span
                  className={`text-xs text-white px-2 py-1 rounded-full ${getStatusColor(
                    course.status
                  )}`}
                >
                  {course.status}
                </span>
              </div>

              {/* Progress bar only if enrolled */}
              {course.isEnrolled && (
                <div className="h-2 w-full bg-gray-200 rounded-full mb-4">
                  <div
                    className="h-full rounded-full bg-purple-600"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto flex items-center justify-between">
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="text-purple-600 hover:underline text-sm"
                >
                  View Course
                </button>

                {(activeTab === "Available Courses" ||
                  activeTab === "Favorite Courses") && (
                  <div className="flex items-center space-x-4">
                    {!enrolledIds.has(course._id) ? (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Enroll
                      </button>
                    ) : (
                      <span className="italic text-gray-500 text-xs">
                        Enrolled
                      </span>
                    )}
                    <button
                      onClick={() => handleToggleFav(course._id)}
                      className={`text-xl ${
                        favIds.has(course._id)
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-600"
                      }`}
                    >
                      {favIds.has(course._id) ? "★" : "☆"}
                    </button>
                  </div>
                )}

                {activeTab === "My Courses" && (
                  <button
                    onClick={() => handleToggleFav(course._id)}
                    className={`text-xl ml-auto ${
                      favIds.has(course._id)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-600"
                    }`}
                  >
                    {favIds.has(course._id) ? "★" : "☆"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
