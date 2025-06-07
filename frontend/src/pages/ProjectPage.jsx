import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Bar } from "react-chartjs-2";
import { useAuth } from "@clerk/clerk-react";
import "react-calendar/dist/Calendar.css";
import "react-calendar/dist/Calendar.css"; // still needed to prevent layout breaks
import "../utils/CustomCalendar.css"; // 👈 custom CSS for fine control
import { CheckCircle, Award } from "lucide-react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";
import toast from "react-hot-toast";
ChartJS.register(BarElement, CategoryScale, LinearScale);
const ProjectPage = () => {
  const [date, setDate] = React.useState(new Date());
  const [projects, setProjects] = useState([]);
  const [resourceSearch, setResourceSearch] = useState("");

  // whenever projects change, pull every project.resources[] into one array
  const allResources = React.useMemo(
    () =>
      projects.flatMap((project) =>
        (project.resources || []).map((res) => ({
          ...res,
          projectTitle: project.title,
        }))
      ),
    [projects]
  );

  // filter by title, topics or project name
  const filteredResources = allResources.filter((r) =>
    `${r.title} ${r.topics.join(" ")} ${r.projectTitle}`
      .toLowerCase()
      .includes(resourceSearch.toLowerCase())
  );

  const now = new Date();

  const resourceCount = allResources.length;

  const activeProjectsCount = projects.filter(
    (p) => p.status === "Pending" || p.status === "In Progress"
  ).length;

  const upcomingDeadlinesCount = projects.filter((p) => {
    const deadline = new Date(p.deadline);
    const diffMs = deadline - now;
    // 3 days in ms = 3 * 24 * 60 * 60 * 1000
    return diffMs > 0 && diffMs <= 3 * 24 * 60 * 60 * 1000;
  }).length;

  const completedProjectsCount = projects.filter(
    (p) => p.status === "Completed"
  ).length;

  






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

  const statusColor = {
    Pending: "bg-primary text-white",
    "In Progress": "bg-gray-300 text-gray-800",
    Completed: "bg-green-500 text-white",
  };

  const { getToken } = useAuth();

  const loadMyProjects = async () => {
      try {
        const token = await getToken();
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projects/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(resp.data.projects || resp.data);
        console.log("Fetched projects:", resp.data.projects || resp.data);
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    };


    const handleCompleteProject = async (project) => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects/${project._id}/complete`,
        {}, // no body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Project marked complete! Badge awarded 🎉');
      // Let parent know to refresh list/details:
      await loadMyProjects();
    } catch (err) {
      console.error(err);
      toast.error('Failed to complete project');
    }
  };
  // fetch "my" projects on mount
  useEffect(() => {
    
    loadMyProjects();
  }, [getToken]);

  return (
    <div className="bg-background min-h-screen p-24">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Projects", value: activeProjectsCount },
          { label: "Available Resources", value: resourceCount, color: "text-green-600" },
          {
            label: "Upcoming Deadlines",
            value: upcomingDeadlinesCount,
            color: "text-red-500",
          },
          {
            label: "Completed Projects",
            value: completedProjectsCount,
            color: "text-green-600",
          },
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
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="text-gray-500 text-center border-b">
                  <th className="py-8 whitespace-nowrap">Project Name</th>
                  <th className="whitespace-nowrap">Status</th>
                  <th className="whitespace-nowrap">Skills Required</th>
                  <th className="whitespace-nowrap">Due Date</th>
                  <th className="whitespace-nowrap">Progress</th>
                  <th className="whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    {/* Project Name */}
                    <td className="py-8 text-center  text-xl whitespace-nowrap">
                      {project.title}
                    </td>

                    {/* Status */}
                    <td className="text-center whitespace-nowrap">
                      <span
                        className={`
              px-4 py-2 rounded-full text-lg font-semibold
              ${statusColor[project.status]}
            `}
                      >
                        {project.status}
                      </span>
                    </td>

                    {/* Skills */}
                    <td className="py-4 whitespace-normal">
                      <div className="flex justify-center flex-wrap gap-1">
                        {project.requiredSkills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="text-center text-lg whitespace-nowrap">
                      {new Date(project.deadline).toLocaleDateString()}
                    </td>

                    {/* Progress */}
                    <td className="text-center whitespace-nowrap">
                      <div className="w-24 bg-gray-200 rounded-full h-2 inline-block align-middle">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2 w-40">
                      <button
                        className="block
                w-full
                text-left
                whitespace-normal break-words
                bg-white border border-gray-300
                rounded-lg 
                px-3 py-1
                text-sm
              "
                        style={{
                          display: "-webkit-box" /* clamp fallback */,
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {project.description}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-center">
                  {project.status !== "Completed" ? (
                   <CheckCircle
                      className="inline-block cursor-pointer text-green-500"
                      size={24}
                      onClick={() => handleCompleteProject(project)}
                      title="Mark project complete"
                    />
                  ) : (
                    <Award
                      className="inline-block cursor-pointer text-indigo-500"
                      size={24}
                      onClick={() => toast('Certificate claimed! 📜')}
                      title="Claim your certificate"
                    />
                  )}
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
            placeholder="Search resources…"
            className="w-full mb-4 px-3 py-2 text-sm border rounded"
            value={resourceSearch}
            onChange={(e) => setResourceSearch(e.target.value)}
          />

          <div className="space-y-4 text-sm p-4  rounded-lg">
            {filteredResources.length > 0 ? (
              filteredResources.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg hover:shadow-sm transition"
                >
                  {/* Resource title as link */}
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {res.title}
                  </a>

                  {/* Which project it lives under */}
                  <p className="text-sm text-gray-500">
                    Project:{" "}
                    <span className="font-semibold">{res.projectTitle}</span>
                  </p>

                  {/* Topics */}
                  <p className="text-sm">
                    Topics:{" "}
                    <span className="italic">{res.topics.join(", ")}</span>
                  </p>
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
      <div className="bg-background py-6 rounded-xl flex flex-col md:flex-row gap-6">
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
