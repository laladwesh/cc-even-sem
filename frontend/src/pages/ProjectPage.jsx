import React, { useState } from "react";
import Calendar from "react-calendar";
import { Bar } from "react-chartjs-2";
import "react-calendar/dist/Calendar.css";
import "react-calendar/dist/Calendar.css"; // still needed to prevent layout breaks
import "./CustomCalendar.css"; // 👈 custom CSS for fine control
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale);
const ProjectPage = () => {
  const [date, setDate] = React.useState(new Date());

  const data = {
    labels: [
      "Team A",
      "Team B",
      "Team C",
      "Team D",
      "Team E",
      "Team F",
      "Team G",
    ],
    datasets: [
      {
        label: "Value",
        data: [12, 19, 3, 5, 3, 7, 8],
        backgroundColor: "#a78bfa", // purple-400
        borderRadius: 5,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: { beginAtZero: true },
        grid: { drawBorder: false },
      },
      x: {
        grid: { display: false },
      },
    },
  };
  const resources = [
    {
      name: "Alice Johnson",
      skills: "Project Management, Strategy",
      available: false,
    },
    {
      name: "Bob Williams",
      skills: "Development, Architecture",
      available: false,
    },
    {
      name: "Charlie Brown",
      skills: "UI/UX Design, Research",
      available: true,
    },
    { name: "Diana Cruz", skills: "Customer Success, CRM", available: true },
    {
      name: "Elijah Smith",
      skills: "Cybersecurity, Compliance",
      available: false,
    },
    {
      name: "Fiona Zhang",
      skills: "Data Analytics, Marketing",
      available: true,
    },
    {
      name: "George Patel",
      skills: "Mobile Dev, QA Testing",
      available: false,
    },
    {
      name: "Hannah Kim",
      skills: "Cloud Engineering, DevOps",
      available: true,
    },
    {
      name: "Isaac Lee",
      skills: "Machine Learning, AI Research",
      available: false,
    },
    {
      name: "Julia Chen",
      skills: "Product Design, Wireframing",
      available: true,
    },
  ];
  const [search, setSearch] = useState("");

  const filteredResources = resources.filter((r) =>
    `${r.name} ${r.skills}`.toLowerCase().includes(search.toLowerCase())
  );

  const projects = [
    {
      name: "Q3 Product Launch",
      status: "Active",
      lead: "Alice Johnson",
      due: "2024-09-30",
      progress: 0.7,
    },
    {
      name: "Website Redesign",
      status: "Active",
      lead: "Bob Williams",
      due: "2024-10-15",
      progress: 0.1,
    },
    {
      name: "Employee Training Platform Update",
      status: "On Hold",
      lead: "Charlie Brown",
      due: "2024-11-01",
      progress: 0.05,
    },
    {
      name: "Customer Onboarding Automation",
      status: "Active",
      lead: "Diana Cruz",
      due: "2024-08-20",
      progress: 0.45,
    },
    {
      name: "Internal Security Audit",
      status: "Completed",
      lead: "Elijah Smith",
      due: "2024-05-15",
      progress: 1.0,
    },
    {
      name: "Marketing Analytics Dashboard",
      status: "Active",
      lead: "Fiona Zhang",
      due: "2024-07-10",
      progress: 0.65,
    },
    {
      name: "Mobile App Bug Fix Sprint",
      status: "Active",
      lead: "George Patel",
      due: "2024-06-05",
      progress: 0.85,
    },
    {
      name: "Cloud Infrastructure Migration",
      status: "On Hold",
      lead: "Hannah Kim",
      due: "2024-12-01",
      progress: 0.3,
    },
    {
      name: "Q4 Strategy Planning",
      status: "Active",
      lead: "Isaac Romero",
      due: "2024-09-10",
      progress: 0.25,
    },
    {
      name: "CRM Integration Upgrade",
      status: "Completed",
      lead: "Jasmine Lee",
      due: "2024-04-25",
      progress: 1.0,
    },
    {
      name: "New Hire Onboarding Flow",
      status: "Completed",
      lead: "Grace Hall",
      due: "2024-08-10",
      progress: 1.0,
    },
    {
      name: "Data Migration Testing",
      status: "Active",
      lead: "Kevin Tran",
      due: "2024-07-15",
      progress: 0.55,
    },
    {
      name: "AI Chatbot Integration",
      status: "On Hold",
      lead: "Linda Park",
      due: "2024-12-20",
      progress: 0.12,
    },
    {
      name: "Accessibility Compliance Review",
      status: "Completed",
      lead: "Michael Young",
      due: "2024-03-18",
      progress: 1.0,
    },
    {
      name: "Content Strategy Overhaul",
      status: "Active",
      lead: "Natalie Chen",
      due: "2024-08-05",
      progress: 0.4,
    },
    {
      name: "DevOps Automation Scripts",
      status: "Active",
      lead: "Oscar Rivera",
      due: "2024-09-22",
      progress: 0.65,
    },
    {
      name: "Social Media Campaign Q4",
      status: "Active",
      lead: "Priya Desai",
      due: "2024-10-05",
      progress: 0.35,
    },
    {
      name: "Legal Compliance Audit",
      status: "On Hold",
      lead: "Quentin Baker",
      due: "2024-11-25",
      progress: 0.18,
    },
    {
      name: "Executive Dashboard Revamp",
      status: "Active",
      lead: "Rachel Gomez",
      due: "2024-07-30",
      progress: 0.72,
    },
    {
      name: "Training Video Production",
      status: "Completed",
      lead: "Samuel Morris",
      due: "2024-05-05",
      progress: 1.0,
    },
    {
      name: "Partner API Expansion",
      status: "Active",
      lead: "Tina Shaw",
      due: "2024-10-28",
      progress: 0.33,
    },
    {
      name: "SaaS Billing Integration",
      status: "Active",
      lead: "Umar Khan",
      due: "2024-07-18",
      progress: 0.6,
    },
    {
      name: "Annual Performance Review System",
      status: "Active",
      lead: "Victoria Lin",
      due: "2024-09-12",
      progress: 0.58,
    },
    {
      name: "Client Survey Analysis Tool",
      status: "Completed",
      lead: "Will Adams",
      due: "2024-04-01",
      progress: 1.0,
    },
    {
      name: "Customer Feedback Workflow",
      status: "On Hold",
      lead: "Xander Zhou",
      due: "2024-11-10",
      progress: 0.27,
    },
    {
      name: "Vendor Management Upgrade",
      status: "Active",
      lead: "Yasmine Ortiz",
      due: "2024-09-01",
      progress: 0.48,
    },
    {
      name: "Backup Policy Update",
      status: "Completed",
      lead: "Zane Peterson",
      due: "2024-04-10",
      progress: 1.0,
    },
    {
      name: "Product Demo Portal",
      status: "Active",
      lead: "Aaron Thomas",
      due: "2024-10-18",
      progress: 0.52,
    },
    {
      name: "Internal Newsletter Redesign",
      status: "On Hold",
      lead: "Bianca Ng",
      due: "2024-12-05",
      progress: 0.2,
    },
    {
      name: "Cross-Team Sync Initiative",
      status: "Active",
      lead: "Carlos Mendes",
      due: "2024-08-28",
      progress: 0.39,
    },
    {
      name: "System Load Testing Phase 2",
      status: "Completed",
      lead: "Dana Wolfe",
      due: "2024-06-01",
      progress: 1.0,
    },
  ];

  const statusColor = {
    Active: "bg-purple-600 text-white",
    "On Hold": "bg-gray-300 text-gray-800",
    Completed: "bg-green-500 text-white",
  };

  return (
    <div className="bg-[#ece6fb] min-h-screen p-6 md:p-24">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Projects", value: 8 },
          { label: "Available Resources", value: 14, color: "text-green-600" },
          { label: "Upcoming Deadlines", value: 5, color: "text-red-500" },
          { label: "Completed Projects", value: 2, color: "text-green-600" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-secondary rounded-lg p-4 text-center shadow"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <h2 className={`text-2xl font-bold ${card.color || ""}`}>
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ongoing Projects */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-semibold mb-4 p-4">Ongoing Projects</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-left border-b">
                  <th className="p-8">Project Name</th>
                  <th>Status</th>
                  <th>Team Lead</th>
                  <th>Due Date</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-8 text-xl">{project.name}</td>
                    <td>
                      <span
                        className={`px-4 py-2 rounded-full text-lg font-semibold ${
                          statusColor[project.status]
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="text-lg">{project.lead}</td>
                    <td className="text-lg">{project.due}</td>
                    <td>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-3 rounded-full"
                          style={{ width: `${project.progress * 100}%` }}
                        />
                      </div>
                    </td>
                    <td>
                      <button className="bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100 text-sm">
                        Resources
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resource Pool */}
        <div className="bg-white rounded-lg self-start shadow p-5">
          <h3 className="text-lg font-semibold mb-4">Resource Pool</h3>
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full mb-4 px-3 py-2 text-sm border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-4 text-sm p-4  rounded-lg">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource, idx) => (
                <div key={idx} className=" p-4 ">
                  <p className="font-medium">{resource.name}</p>
                  <p className="text-gray-500">{resource.skills}</p>
                  {resource.available && (
                    <span className="inline-block mt-1 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic py-6">
                No matching resources found.
              </p>
            )}
          </div>
          {/* <div className="space-y-4 text-sm">
            {resources.map((resource, idx) => (
              <div key={idx}>
                <p className="font-medium">{resource.name}</p>
                <p className="text-gray-500">{resource.skills}</p>
                {resource.available && (
                  <span className="inline-block mt-1 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                    Available
                  </span>
                )}
              </div>
            ))}
          </div> */}
        </div>
      </div>
      <div className="bg-indigo-50 p-6 rounded-xl flex flex-col md:flex-row gap-6">
        {/* Calendar Card */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4">Project Timeline View</h2>
          <div className="flex justify-center py-24">
            <Calendar
              onChange={setDate}
              value={date}
              next2Label={null}
              prev2Label={null}
              className="custom-calendar px-24"
              tileClassName={({ date: tileDate, view }) =>
                view === "month" &&
                tileDate.toDateString() === new Date().toDateString()
                  ? "today-tile"
                  : ""
              }
            />
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4">
            Team Workload Distribution
          </h2>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
