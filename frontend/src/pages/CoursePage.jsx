import React, { useState } from "react";
const chapters = [
  { id: 1, title: "Section 1: Introduction", duration: "3min" },
  { id: 2, title: "Section 2: Essential Fundamentals", duration: "1hr 4min" },
  { id: 3, title: "Section 3: Program Development", duration: "44min" },
  { id: 4, title: "Section 4: Compiler and IDE Setup", duration: "38min" },
  { id: 5, title: "Section 5: C++ Basics", duration: "3hr 5min" },
  { id: 6, title: "Section 6: Conditional Statements", duration: "2hr" },
  { id: 7, title: "Section 7: Loops", duration: "1hr 48min" },
  { id: 8, title: "Section 8: Arrays", duration: "1hr 55min" },
];
const CoursePage = () => {
  const [checkedChapters, setCheckedChapters] = useState([]);

  const toggleCheck = (id) => {
    setCheckedChapters((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const progress = Math.round((checkedChapters.length / chapters.length) * 100);
  return (
    <div className="bg-background rounded-lg px-11 py-4  mt-20 max-w-full">
      <h3 className="text-4xl font-semibold py-5 mb-3 text-gray-800">
        Advanced React Patterns
      </h3>
      <div className="flex justify-center mb-6">
        <img
        src="https://picsum.photos/id/3/1200/500"
        alt="Advanced React Patterns"
        className="w-full px-12  max-h-[65vh] rounded-lg object-cover"
      />
      </div>
      <div className="bg-background min-h-screen p-6 flex justify-center">
        <div className=" p-6 rounded-lg w-full max-w-8xl flex gap-6">
          {/* Left Side: Chapter List */}
          <div className="flex-1 bg-white h-auto">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-start mb-4 border rounded-lg p-4"
              >
                <input
                  type="checkbox"
                  checked={checkedChapters.includes(chapter.id)}
                  onChange={() => toggleCheck(chapter.id)}
                  className="mt-1 mr-4 accent-purple-600"
                />
                <div className="w-full">
                  <div className="flex justify-between font-medium text-gray-800">
                    <span>{chapter.title}</span>
                    <span className="text-sm text-gray-500">
                      {chapter.duration}
                    </span>
                  </div>
                  {checkedChapters.includes(chapter.id) && (
                    <div className="mt-2 bg-purple-50 p-2 rounded-md text-sm flex items-center justify-between">
                      <div className="flex gap-4">
                        <span className="text-purple-700 font-semibold cursor-pointer">
                          📺 Video
                        </span>
                        <button className="bg-white border border-purple-400 text-purple-600 px-2 py-1 rounded text-xs hover:bg-purple-100">
                          Resources
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button
              className="mt-6 flex mb-8  justify-center px-2 mx-auto bg-primary  text-white py-2 rounded hover:bg-purple-700"
              disabled={checkedChapters.length < chapters.length}
            >
              Claim Certificate
            </button>
          </div>

          {/* Right Side: Progress */}
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
    </div>
  );
};

export default CoursePage;
