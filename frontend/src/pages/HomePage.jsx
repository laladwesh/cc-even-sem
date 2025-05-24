import {
  Briefcase,
  Monitor,
  Star,
  Users,
  Settings,
  Gift,
  BookOpenCheck,
  BadgeCheck,
} from "lucide-react";
import {  useState } from "react";

const blogPosts = [
  {
    title: "Top 5 Employee Training Trends in 2024",
    category: "Training",
    date: "October 28, 2024",
    image: "/blog1.png",
  },
  {
    title: "How Smart Allocation Boosts Project Success",
    category: "Productivity",
    date: "October 20, 2024",
    image: "/blog2.png",
  },
  {
    title: "Driving Motivation Through Effective Rewards",
    category: "Performance",
    date: "October 15, 2024",
    image: "/blog3.png",
  },
  {
    title: "Building Future-Ready Skills in Your Team",
    category: "Development",
    date: "October 10, 2024",
    image: "/blog4.png",
  },
  {
    title: "Cultivating a Culture of Continuous Growth",
    category: "Growth",
    date: "October 5, 2024",
    image: "/blog5.png",
  },
  {
    title: "Enhancing Collaboration Through Training",
    category: "Teams",
    date: "September 28, 2024",
    image: "/blog6.png",
  },
  // Add 6 more dummy articles
  {
    title: "Adapting Learning Paths with AI",
    category: "Innovation",
    date: "September 20, 2024",
    image: "/blog7.jpg",
  },
  {
    title: "Measuring ROI of Employee Development",
    category: "Analytics",
    date: "September 12, 2024",
    image: "/blog8.jpg",
  },
  {
    title: "Remote Work & Upskilling Balance",
    category: "Remote Work",
    date: "September 1, 2024",
    image: "/blog9.jpg",
  },
  {
    title: "Training in the Age of Automation",
    category: "Future Skills",
    date: "August 20, 2024",
    image: "/blog10.jpg",
  },
  {
    title: "Managerial Role in Learning Strategy",
    category: "Leadership",
    date: "August 10, 2024",
    image: "/blog11.jpg",
  },
  {
    title: "Breaking Silos with Cross-functional Training",
    category: "Collaboration",
    date: "August 1, 2024",
    image: "/blog12.jpg",
  },
];


export default function HeroSection({ blogRef, reviewsRef }) {
  const [expanded, setExpanded] = useState(false);

  const displayedPosts = expanded ? blogPosts : blogPosts.slice(0, 6);
  const features = [
    {
      title: "Smart Project Allocation",
      desc: "Efficiently assign resources and teams to projects strategically based on skill and availability.",
      icon: <Briefcase className="w-8 h-8 text-primary mb-4 mx-auto" />,
    },
    {
      title: "Personalized Dashboards",
      desc: "Track individual progress, receive coaching insights, and manage diverse learner data.",
      icon: <Monitor className="w-8 h-8 text-primary mb-4 mx-auto" />,
    },
    {
      title: "Performance Rewards",
      desc: "Recognize and celebrate achievements with automated milestones and reward systems.",
      icon: <Star className="w-8 h-8 text-primary mb-4 mx-auto" />,
    },
    {
      title: "Employee Development",
      desc: "Foster continuous learning and skill enhancement across your workforce.",
      icon: <Users className="w-8 h-8 text-primary mb-4 mx-auto" />,
    },
  ];

  return (
    <div className="bg-[#e7d9f9] w-full px-6 md:px-36 py-24">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Text Content */}
        <div className="max-w-xl">
          <p className="text-base md:text-lg text-purple-700 font-semibold mb-3">
            Employee Development & Training
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Grow Your Workforce,
            <br />
            <span className="text-primary">Grow Your Company</span>
          </h1>
          <p className="text-lg text-gray-800 mb-8">
            Unlock the full potential of your employees with our integrated
            platform for project allocation, training management, and
            performance recognition.
          </p>
          <button className="bg-primary hover:bg-primary/80 text-lg text-white px-7 py-3 rounded-md shadow-md">
            Let’s get started
          </button>
        </div>

        {/* Image */}
        <div className="w-full md:w-6/12">
          <img
            src="/hero.png"
            alt="Hero"
            className="rounded-md shadow-lg w-full"
          />
        </div>
      </div>

      {/* Features */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-12">
          Key Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#ABAEF2] p-7 rounded-lg shadow-md text-left hover:shadow-lg transition"
            >
              <div className="flex flex-col items-start">
                <span className="w-full">{feature.icon}</span>
                <h3 className="text-xl mx-auto font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-center text-gray-800">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#fff] w-full px-11 mt-20 rounded-lg py-24 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-purple-700 mb-3">
          Tangible Impact on Your Business
        </h2>
        <p className="text-base md:text-lg text-gray-700 mb-12">
          See the measurable results of investing in your employees’ growth and
          development.
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Users className="h-8 w-8 text-primary mb-2" />,
              value: "+30%",
              label: "Increased Employee Engagement",
            },
            {
              icon: <Settings className="h-8 w-8 text-primary mb-2" />,
              value: "+25%",
              label: "Improved Project Efficiency",
            },
            {
              icon: <Star className="h-8 w-8 text-primary mb-2" />,
              value: "+40%",
              label: "Higher Training Completion Rates",
            },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-white border border-secondary p-6 rounded-lg text-center hover:shadow-md transition"
            >
              <div className="flex justify-center">{metric.icon}</div>
              <h3 className="text-2xl font-bold text-primary">
                {metric.value}
              </h3>
              <p className="text-sm text-gray-700 mt-1">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Image */}
        <div className="w-full">
          <img
            src="/impact.png"
            alt="Impact"
            className="rounded-lg w-full max-h-[400px] object-cover"
          />
        </div>
      </div>
      <div className="bg-[#c9bff0] w-full px-6 py-24">
        {/* How it works */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-12">
          How CompanyGrow Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-20">
          {[
            {
              icon: <Gift className="h-8 w-8 text-primary mx-auto mb-2" />,
              title: "Allocate Projects",
              desc: "Managers assign projects and allocate resources within the platform.",
            },
            {
              icon: (
                <BookOpenCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              ),
              title: "Engage in Training",
              desc: "Employees access personalized learning plans and complete training modules.",
            },
            {
              icon: (
                <BadgeCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              ),
              title: "Achieve & Get Rewarded",
              desc: "Progress is monitored, and users are recognized and rewarded.",
            },
          ].map((step, i) => (
            <div
              key={i}
              ref={reviewsRef}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              {step.icon}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-700">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h3  className="text-3xl md:text-4xl font-semibold text-center text-primary mb-12 ">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {[
            {
              quote:
                "CompanyGrow revolutionized how our company approaches training. Remote training is now accessible, tracked, and effective.",
              name: "Sarah Chen",
              role: "Head of HR, Innovate Solutions",
              img: "/user1.png",
            },
            {
              quote:
                "The performance review and notifications feature helped our team focus and grow faster than ever.",
              name: "Daniel Kim",
              role: "Project Lead, Quorum Corp",
              img: "/user2.png",
            },
            {
              quote:
                "A fantastic platform for aligning training with performance goals. Employee morale is up significantly!",
              name: "Emily Carter",
              role: "Training Manager, Vortex Innovations",
              img: "/user3.png",
            },
            {
              quote:
                "The personalized dashboard and gamified rewards keep our workforce highly engaged!",
              name: "Matthew Wong",
              role: "VP of Operations, Synergy Dynamics",
              img: "/user4.png",
            },
          ].map((user, i) => (
            <div
              key={i}
              className="flex h-full bg-white p-6 rounded-xl shadow-md gap-5 items-start"
            >
              <img
                src={user.img}
                alt={user.name}
                className="w-60 h-60 object-cover"
              />
              <div className="flex flex-col justify-between h-full">
                <p className="text-xl italic text-gray-700 mb-2">
                  "{user.quote}"
                </p>
                <div className="mt-auto">
                  <p className="font-semibold text-2xl text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-lg text-gray-600">{user.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div ref={blogRef} className="bg-[#d7ccf2] py-20 px-4 text-center">
      <h2 className="text-4xl font-semibold mb-10 text-gray-800">Latest from Our Blog</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {displayedPosts.map((post, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img src={post.image} alt={post.title} className="h-56 w-full object-cover" />
            <div className="p-4 text-left">
              <span className="text-lg font-semibold text-primary">{post.category}</span>
              <h3 className="text-base font-semibold text-gray-800 mt-1">{post.title}</h3>
              <p className="text-lg text-gray-500 mt-1">{post.date}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-8 px-6 py-3 rounded-lg bg-white text-gray-700 font-semibold border hover:bg-purple-100 transition"
      >
        {expanded ? "Close" : "View More Articles"}
      </button>
    </div>
    <div className="bg-[#7F55E0] py-24 mt-20 text-white px-6 rounded-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Grow Your Team?</h2>
          <p className="mb-4">
            Subscribe to our newsletter for insights on employee development.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md text-black w-full sm:w-auto"
            />
            <button className="bg-purple-900 hover:bg-purple-800 text-white px-5 py-2 rounded-md font-semibold">
              Subscribe
            </button>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="flex-1">
          <img
            src="/news.png"
            alt="Grow arrows"
            className="w-full h-full max-w-md mx-auto rounded"
          />
        </div>
      </div>
    </div>
    </div>
  );
}
