import { useState } from "react";
import { useNavigate } from "react-router-dom";
const allCourses = {
  
  "My Courses": [
    {
      title: "Advanced React Patterns",
      image: "https://picsum.photos/id/3/5000/3333",
      status: "In Progress",
      progress: 85,
    },
    {
      title: "Leadership Skills for Managers",
      image: "https://picsum.photos/id/5/5000/3333",
      status: "In Progress",
      progress: 80,
    },
    {
      title: "Cloud Computing Basics",
      image: "https://picsum.photos/id/12/5000/3333",
      status: "In Progress",
      progress: 95,
    },
    {
      title: "UI/UX Design Principles",
      image: "https://picsum.photos/id/11/5000/3333",
      status: "In Progress",
      progress: 70,
    },
    {
      title: "Advanced SQL Techniques",
      image: "https://picsum.photos/id/6/5000/3333",
      status: "In Progress",
      progress: 55,
    },
    {
      title: "Data Analysis with Python",
      image: "https://picsum.photos/id/6/5000/3333",
      status: "Completed",
      progress: 100,
    },
    {
      title: "Cybersecurity Fundamentals",
      image: "https://picsum.photos/id/13/5000/3333",
      status: "Not Started",
      progress: 30,
    },
    {
      title: "Machine Learning Introduction",
      image: "https://picsum.photos/id/8/5000/3333",
      status: "Not Started",
      progress: 15,
    },
    {
      title: "Effective Project Management",
      image: "https://picsum.photos/id/4/5000/3333",
      status: "Completed",
      progress: 100,
    },
    {
      title: "Financial Literacy for Employees",
      image: "https://picsum.photos/id/7/5000/3333",
      status: "Completed",
      progress: 100,
    },
  ],
  "Available Courses": [
    {
      title: "Cybersecurity Fundamentals",
      image: "https://picsum.photos/id/13/5000/3333",
      status: "Not Started",
      progress: 30,
    },
    {
      title: "Machine Learning Introduction",
      image: "https://picsum.photos/id/8/5000/3333",
      status: "Not Started",
      progress: 15,
    },
    {
      title: "Financial Literacy for Employees",
      image: "https://picsum.photos/id/7/5000/3333",
      status: "Completed",
      progress: 100,
    },
    {
      title: "UI/UX Design Principles",
      image: "https://picsum.photos/id/11/5000/3333",
      status: "In Progress",
      progress: 70,
    },
    {
      title: "Advanced SQL Techniques",
      image: "https://picsum.photos/id/6/5000/3333",
      status: "In Progress",
      progress: 55,
    },
    {
      title: "Cloud Computing Basics",
      image: "https://picsum.photos/id/12/5000/3333",
      status: "In Progress",
      progress: 95,
    },
    {
      title: "Leadership Skills for Managers",
      image: "https://picsum.photos/id/5/5000/3333",
      status: "In Progress",
      progress: 80,
    },
    {
      title: "Effective Project Management",
      image: "https://picsum.photos/id/4/5000/3333",
      status: "Completed",
      progress: 100,
    },
    {
      title: "Data Analysis with Python",
      image: "https://picsum.photos/id/6/5000/3333",
      status: "Completed",
      progress: 100,
    },
    {
      title: "Advanced React Patterns",
      image: "https://picsum.photos/id/3/5000/3333",
      status: "In Progress",
      progress: 85,
    },
    {
      title: "Business Communication Essentials",
      image: "https://picsum.photos/id/9/5000/3333",
      status: "Not Started",
      progress: 0,
    },
    {
      title: "Ethical Hacking Basics",
      image: "https://picsum.photos/id/10/5000/3333",
      status: "Not Started",
      progress: 10,
    },
  ],
  "Favorite Courses": [
    {
      title: "Data Analysis with Python",
      image: "https://picsum.photos/id/6/5000/3333",
      status: "Completed",
      progress: 100,
    },
    {
      title: "Cloud Computing Basics",
      image: "https://picsum.photos/id/12/5000/3333",
      status: "In Progress",
      progress: 95,
    },
    {
      title: "Effective Project Management",
      image: "https://picsum.photos/id/4/5000/3333",
      status: "Completed",
      progress: 100,
    },
    {
      title: "Advanced SQL Techniques",
      image: "https://picsum.photos/id/6/5000/3333",
      status: "In Progress",
      progress: 55,
    },
    {
      title: "Machine Learning Introduction",
      image: "https://picsum.photos/id/8/5000/3333",
      status: "Not Started",
      progress: 15,
    },
    {
      title: "Leadership Skills for Managers",
      image: "https://picsum.photos/id/5/5000/3333",
      status: "In Progress",
      progress: 80,
    },
    {
      title: "Cybersecurity Fundamentals",
      image: "https://picsum.photos/id/13/5000/3333",
      status: "Not Started",
      progress: 30,
    },
    {
      title: "Financial Literacy for Employees",
      image: "https://picsum.photos/id/7/5000/3333",
      status: "Completed",
      progress: 100,
    },
    {
      title: "UI/UX Design Principles",
      image: "https://picsum.photos/id/11/5000/3333",
      status: "In Progress",
      progress: 70,
    },
    {
      title: "Team Collaboration Tools",
      image: "https://picsum.photos/id/15/5000/3333",
      status: "In Progress",
      progress: 40,
    },
  ],
};


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

const DashboardPage = () => {
      const [activeTab, setActiveTab] = useState("My Courses");
      const navigate = useNavigate();
  return (
    <div className="bg-[#e7d9f9] w-full px-6 md:px-36 py-24">
      <h2 className="text-xl font-semibold mb-4">Training Dashboard</h2>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Courses Completed", count: 18 },
          { title: "Active Courses", count: 8 },
          { title: "Certificates Earned", count: 5 },
          { title: "Upcoming Deadlines", count: 2 },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#ABAEF2] p-4 rounded-lg text-center">
            <p className="text-sm text-gray-700">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Tabs (just visuals for now) */}
   <div className="flex mb-6 space-x-4">
        {Object.keys(allCourses).map((tab, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === tab ? "bg-white shadow" : "bg-purple-100"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {allCourses[activeTab].map((course, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img src={course.image} alt={course.title} className="h-40 w-full object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">{course.title}</h3>
                <span
                  className={`text-xs text-white px-2 py-1 rounded-full ${getStatusColor(
                    course.status
                  )}`}
                >
                  {course.status}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                <div
                  className={`h-full rounded-full ${getStatusColor(course.status)}`}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <button onClick={() => navigate(`/course/${course.progress}`)} className="text-sm text-purple-600 hover:underline">View Course</button>
                <button className="text-red-500 hover:text-red-600 text-lg">☆</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
