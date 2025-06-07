import {
  Trophy,
  Vibrate as Certificate,
  Award,
  Star,
  Gift,
  BadgeCheck,
  AwardIcon,
  CalendarDays,
  Search
} from "lucide-react";
import {
  achievements,
  notifications,
  highlights,
  rewardInfo,
} from "../utils/performanceData";

const iconMap = {
  Trophy,
  Certificate,
  Award,
  Star,
  Gift,
  BadgeCheck,
};

const PerformanceAndRewards = () => {
  return (<div className="py-16 bg-background">
    <div className="bg-background min-h-screen px-4 sm:px-6 md:px-12 lg:px-36 py-6 sm:py-8 md:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold mb-4">
        Performance & Rewards
      </h2>

      {/* Top Achievements */}
      {achievements.length !== 0 && (
        <h2 className="text-xl sm:text-2xl text-primary font-semibold mb-4">
          Your Achievements at a Glance
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 border-b-2 py-8 sm:py-10 border-white mb-8">
        {achievements.map((item, idx) => (
          <div
            key={idx}
            className="bg-secondary text-black p-4 sm:p-6 rounded-lg flex flex-col items-start gap-3 sm:gap-4"
          >
            <div className="bg-primary text-white rounded-full p-3 sm:p-4">
              <AwardIcon size={36} />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="font-semibold text-lg sm:text-xl">{item.title}</p>
              <p className="text-base sm:text-lg">{item.description}</p>
              <p className="text-base sm:text-lg text-primary font-semibold">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <h3 className="text-xl sm:text-2xl text-primary font-semibold mb-4">
        Recent Notifications & Rewards
      </h3>
      <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-4 mb-4">
        <div className="flex items-center border px-2 sm:px-3 py-1 sm:py-2 rounded w-full md:w-1/2 bg-white">
          <Search size={16} className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            className="w-full text-xs sm:text-sm outline-none"
          />
        </div>
        <select className="text-sm sm:text-base border px-2 sm:px-3 py-1 sm:py-2 rounded bg-white">
          <option>All Types</option>
        </select>
        <select className="text-sm sm:text-base border px-2 sm:px-3 py-1 sm:py-2 rounded bg-white">
          <option>All Status</option>
        </select>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-10 border-b-2 pb-8 sm:pb-10 border-white overflow-auto max-h-80 sm:max-h-96">
        {notifications.map((note, i) => (
          <div
            key={i}
            className="bg-white p-3 sm:p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <div className="flex flex-col items-center text-gray-500 text-xs sm:text-sm w-full sm:w-24 mt-1">
              <CalendarDays size={36} className="text-primary mb-1 w-full" />
              <span className="text-[11px] sm:text-[13px] text-center">
                {note.date}
              </span>
            </div>
            <div className="flex flex-col px-4 sm:px-6 justify-center flex-1">
              <p className="text-base sm:text-lg font-medium text-black">
                {note.message}
              </p>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                {note.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Highlights */}
      <h3 className="text-xl sm:text-2xl text-primary py-6 sm:py-8 font-semibold mb-4">
        Historical Performance Highlights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 border-b-2 pb-8 sm:pb-10 border-white">
        {Object.entries(highlights).map(([year, points]) => (
          <div
            key={year}
            className="bg-secondary text-black p-4 sm:p-6 rounded-lg space-y-2"
          >
            <p className="font-semibold text-xl sm:text-2xl">
              {year} Highlights
            </p>
            <ul className="text-base sm:text-lg text-gray-700 list-disc pl-5">
              {points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Understanding Rewards */}
      <h3 className="text-xl sm:text-2xl text-primary py-6 sm:py-8 font-semibold mb-4">
        Understanding Your Rewards
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {rewardInfo.map((reward, i) => {
          const Icon = iconMap[reward.icon];
          return (
            <div
              key={i}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-3"
            >
              <Icon size={36} className="text-purple-600 mb-2" />
              <p className="font-semibold text-lg sm:text-xl">
                {reward.title}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {reward.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default PerformanceAndRewards;
