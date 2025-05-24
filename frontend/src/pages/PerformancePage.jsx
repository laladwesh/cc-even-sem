import {
  Trophy,
  Vibrate as Certificate,
  Award,
  Search,
  Star,
  Gift,
  BadgeCheck,
  AwardIcon,
  CalendarDays
} from "lucide-react";
import {
  achievements,
  notifications,
  highlights,
  rewardInfo,
} from "./performanceData";

const iconMap = {
  Trophy,
  Certificate,
  Award,
  Star,
  Gift,
  BadgeCheck,
};

const PerformanceAndRewards = () => {
  return (
    <div className="bg-background min-h-screen p-6 px-36 pt-24 rounded-lg">
      <h2 className="text-5xl font-semibold mb-6">Performance & Rewards</h2>
      {achievements.length !== 0 && (
        <h2 className="text-2xl text-primary  font-semibold">
          Your Achievements At a Glance
        </h2>
      )}
      {/* Top Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 py-12 border-white gap-8 mb-8">
        {achievements.map((item, idx) => {
          return (
            <div
              key={idx}
              className="bg-secondary text-black p-8 rounded-lg flex flex-col items-start gap-4"
            >
              <div className="bg-primary text-white rounded-full p-4">
                {" "}
                <AwardIcon size={50} />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-xl">{item.title}</p>
                <p className="text-xl">{item.description}</p>
                <p className="text-xl text-primary font-semibold">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notifications */}
      <h3 className="text-3xl text-primary font-semibold  mb-4">
        Recent Notifications & Rewards
      </h3>
      <div className="flex  flex-col md:flex-row md:items-center gap-2 mb-4">
        <div className="flex items-center border px-3 py-2 rounded w-full md:w-1/2 bg-white">
          <Search size={16} className="mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            className="w-full text-sm outline-none"
          />
        </div>
        <select className="text-sm border px-3 py-2 rounded bg-white">
          <option>All Types</option>
        </select>
        <select className="text-sm border px-3 py-2 rounded bg-white">
          <option>All Status</option>
        </select>
      </div>

<div className="space-y-3 mb-10 border-b-2 pb-12 overflow-auto max-h-96 border-white">
  {notifications.map((note, i) => (
    <div
      key={i}
      className="bg-white p-4 rounded-lg shadow-sm flex items-start gap-3"
    >
      <div className="flex flex-col items-center text-gray-500 text-sm w-20 mt-1">
        <CalendarDays size={44} className="text-primary mb-1 w-28" />
        <span className="text-[13px] text-center">{note.date}</span>
      </div>
      <div className="flex w-full flex-col px-8 justify-center">
        <p className="text-xl font-medium text-black">{note.message}</p>
        <p className="text-xl text-gray-500 mt-1">{note.detail}</p>
      </div>
    </div>
  ))}
</div>


      {/* Historical Highlights */}
      <h3 className="text-3xl text-primary py-8  font-semibold mb-4">
        Historical Performance Highlights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b-2 pb-12 border-white">
        {Object.entries(highlights).map(([year, points]) => (
          <div
            key={year}
            className="bg-secondary text-black p-8 space-y-2 rounded-lg"
          >
            <p className="font-semibold text-2xl">{year} Highlights</p>
            <ul className="text-xl text-gray-700 list-none mt-1">
              {points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Understanding Rewards */}
      <h3 className="text-3xl text-primary py-8 font-semibold mb-4">
        Understanding Your Rewards
      </h3>
      <div className="grid grid-cols-1 pb-16 md:grid-cols-4 gap-8">
        {rewardInfo.map((reward, i) => {
          const Icon = iconMap[reward.icon];
          return (
            <div
              key={i}
              className="bg-white p-8 space-y-4 rounded-lg shadow-sm"
            >
              <Icon size={44} className="text-purple-600 mb-2" />
              <p className="font-semibold text-2xl">{reward.title}</p>
              <p className="text-lg text-gray-600">{reward.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PerformanceAndRewards;
