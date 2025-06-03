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

  useEffect(() => {
    const syncUser = async () => {
      try {
        const token = await getToken();
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/sync`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Failed to sync Clerk user:", err);
      }
    };

    if (user) {
      syncUser();
    }
  }, [user, getToken]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(data.courses);
        setUserData(data.user);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };
    if (user) load();
  }, [user, getToken]);

  if (!userData)
    return (
      <p className="p-4 text-center text-gray-600 text-base">Loading…</p>
    );

  const enrolledIds = new Set(
    userData.enrolledCourses.map((c) => String(c.courseId ?? c._id))
  );
  const favIds = new Set(
    userData.favouriteCourses.map((c) => String(c.courseId))
  );

  const myCourses = courses.filter((c) => enrolledIds.has(c._id));
  const favCourses = courses.filter((c) => favIds.has(c._id));
  const availableCourses = courses;

  const tabs = {
    "My Courses": myCourses,
    "Favorite Courses": favCourses,
    "Available Courses": availableCourses,
  };

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
        enrolledCourses: [...d.enrolledCourses, { courseId }],
      }));
    } catch (err) {
      console.error("Enroll failed", err);
    }
  };

  return (
    <div className="bg-[#e7d9f9] w-full px-4 sm:px-6 lg:px-36 py-12 sm:py-16 md:py-24">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-gray-800 text-left">
        Training Dashboard
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap justify-start mb-6 space-x-2 sm:space-x-4">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            className={`px-3 sm:px-4 py-2 rounded-md font-medium text-sm sm:text-base ${
              activeTab === tab
                ? "bg-white shadow"
                : "bg-purple-100 hover:bg-purple-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {tabs[activeTab].map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <img
              src={course.thumbnail || course.image}
              alt={course.title}
              className="h-40 sm:h-48 md:h-56 w-full object-cover"
            />
            <div className="p-3 sm:p-4 flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                  {course.title}
                </h3>
                <span
                  className={`mt-1 sm:mt-0 text-xs sm:text-sm text-white px-2 py-1 rounded-full ${getStatusColor(
                    course.status
                  )}`}
                >
                  {course.status}
                </span>
              </div>

              <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                <div
                  className="h-full rounded-full bg-purple-600"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="text-sm sm:text-base text-purple-600 hover:underline mb-2 sm:mb-0"
                >
                  View Course
                </button>

                {(activeTab === "Available Courses" ||
                  activeTab === "Favorite Courses") && (
                  <div className="flex items-center space-x-4">
                    {!enrolledIds.has(course._id) ? (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="text-green-600 hover:text-green-800 text-sm sm:text-base font-medium"
                      >
                        Enroll
                      </button>
                    ) : (
                      <span className="text-gray-500 italic text-xs sm:text-sm">
                        Enrolled
                      </span>
                    )}
                    <button
                      onClick={() => handleToggleFav(course._id)}
                      className={`text-lg sm:text-xl ${
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
                    className={`ml-auto text-lg sm:text-xl ${
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
