// src/components/AnalyticsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export default function AnalyticsDashboard() {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const resp  = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(resp.data);
    })();
  }, [getToken]);

  if (!analytics) return <p>Loading analytics…</p>;

  const {
    summary,             // { totalEmployees, activeProjects, trainingCompletePct, avgSkillScore }
    projectOverview,     // [ { name, status, deadline, manager, employees } ]
    trainingProgress,    // { pctComplete }
    skillProfile,        // [ { skill, value } ]
    performanceTrend,    // [ { month, value } ]
    badgeCounts,         // [ { _id, count } ]
    topEmployees,        // [ { name, score } ]
    courseEnrollments    // [ { _id (YYYY-MM), count } ]
  } = analytics;

  const COLORS = ['#8884d8','#82ca9d','#ffc658','#d0ed57','#a4de6c'];

  return (
    <div className="space-y-8 p-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Total Employees</p>
          <h3 className="text-2xl font-bold">{summary.totalEmployees}</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Active Projects</p>
          <h3 className="text-2xl font-bold">{summary.activeProjects}</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Training Completion</p>
          <h3 className="text-2xl font-bold">{summary.trainingCompletePct}%</h3>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500">Avg. Skill Score</p>
          <h3 className="text-2xl font-bold">{summary.avgSkillScore}/100</h3>
        </div>
      </div>

      {/* 2. Project Overview & 3. Training Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold mb-2">Project Overview</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {['Name','Status','Deadline','Manager','Employees'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projectOverview.map((p, i) => (
                  <tr key={i} className={i%2 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.status}</td>
                    <td className="px-3 py-2">
                      {new Date(p.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">{p.manager}</td>
                    <td className="px-3 py-2 text-center">{p.employees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold mb-2">Training Progress</h4>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-indigo-500 transition-width"
              style={{ width: `${trainingProgress.pctComplete}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {trainingProgress.pctComplete}% Completed
          </p>
        </div>
      </div>

      {/* 4. Overall Skill Profile & 5. Avg Performance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold mb-2">Overall Skill Profile</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillProfile}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={30} domain={[0,100]} />
              <Radar
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.4}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold mb-2">Avg Performance Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0,100]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Badge Distribution & 7. Top Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4 lg:col-span-2">
          <h4 className="font-semibold mb-2">Badge Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={badgeCounts}
                dataKey="count"
                nameKey="_id"
                outerRadius={80}
                label
              >
                {badgeCounts.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold mb-2">Top Employees</h4>
          <ul className="space-y-3">
            {topEmployees.map((e, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{e.name}</span>
                <span className="text-gray-600">{e.score}/100</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 8. Additional Metrics (Original 3 Charts) */}
      <section>
        <h4 className="text-xl font-semibold mb-4">Additional Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Projects Completed / Month */}
          <div className="bg-white rounded-lg shadow p-4">
            <h5 className="font-semibold mb-2">Projects Completed / Month</h5>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Course Enrollments / Month */}
          <div className="bg-white rounded-lg shadow p-4">
            <h5 className="font-semibold mb-2">Course Enrollments / Month</h5>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={courseEnrollments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Badge Assignments */}
          <div className="bg-white rounded-lg shadow p-4">
            <h5 className="font-semibold mb-2">Badge Assignments</h5>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={badgeCounts}
                  dataKey="count"
                  nameKey="_id"
                  outerRadius={60}
                  label
                >
                  {badgeCounts.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
