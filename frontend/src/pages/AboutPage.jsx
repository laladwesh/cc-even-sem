import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-[#e7d9f9]">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[90vh] flex items-center justify-center"
        style={{ backgroundImage: "url('/herobg.png')" }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-60"></div>
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
            Empowering Growth <br /> Through People
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
            At CompanyGrow, we believe in unlocking the full potential of every
            employee. Our platform is dedicated to fostering a culture of
            continuous learning, impactful project contribution, and recognized
            achievement.
          </p>
        </div>
      </div>

      {/* Vision & Core Values */}
      <div className="bg-[#e8e6ff] py-12 sm:py-16 px-4 sm:px-10 md:px-20 lg:px-44">
        <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-16">
          {/* Vision Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-6 sm:mb-8">
              Our Vision
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
              To be the leading platform for employee development, creating a
              global workforce that is highly skilled, engaged, and motivated to
              drive innovation and achieve organizational excellence.
            </p>
          </div>

          {/* Core Values Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-6 sm:mb-8">
              Our Core Values
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  title: "Growth Mindset",
                  desc: "We are committed to continuous learning and improvement, both individually and as a company.",
                },
                {
                  title: "Collaboration",
                  desc: "We foster a collaborative environment where teamwork and shared knowledge drive success.",
                },
                {
                  title: "Excellence",
                  desc: "We strive for the highest standards in everything we do, from our platform to our customer service.",
                },
                {
                  title: "Recognition",
                  desc: "We believe in celebrating achievements and recognizing the valuable contributions of every team member.",
                },
                {
                  title: "Integrity",
                  desc: "We operate with transparency, honesty, and ethical practices in all interactions.",
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="border-l-4 border-violet-600 pl-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-800 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="bg-[#e8e6ff] py-12 sm:py-16 px-4 sm:px-10 md:px-44">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center text-gray-900 mb-10 sm:mb-12">
          Meet Our Leadership Team
        </h2>
        <div className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 place-items-center">
          {[
            { name: "Alice Chen", role: "CEO" },
            { name: "Bob Smith", role: "Head of Product" },
            { name: "Charlie Davis", role: "Lead Developer" },
            { name: "Diana Miller", role: "HR Manager" },
            { name: "Ethan White", role: "Marketing Lead" },
            { name: "Fiona Green", role: "Customer Success" },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 text-center w-full max-w-xs hover:shadow-lg transition-shadow"
            >
              <img
                src={`https://randomuser.me/api/portraits/${
                  idx % 2 === 0 ? "women" : "men"
                }/${idx + 10}.jpg`}
                alt={member.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vibrant Culture */}
      <div className="bg-[#e4e4fb] py-12 sm:py-16 px-4">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            Our Vibrant Culture
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
            CompanyGrow is more than just a platform; it’s a community. We
            cultivate an environment that encourages creativity, supports
            work-life balance, and celebrates diversity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {[
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df", // team whiteboard
            "https://images.unsplash.com/photo-1629904853716-f0bc54eea481", // presentation
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7", // office space
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf", // puzzle hands
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // scenic view
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0", // mentorship meeting
          ].map((url, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl shadow-md"
            >
              <img
                src={`${url}?auto=format&fit=crop&w=600&q=80`}
                alt={`Culture ${idx + 1}`}
                className="w-full h-40 sm:h-48 md:h-56 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#e4e4fb] py-12 sm:py-16 px-4">
        <div className="bg-white max-w-7xl mx-auto rounded-md py-8 sm:py-10 px-4 sm:px-6 lg:px-10 text-center shadow-md">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Ready to Grow With Us?
          </h2>
          <p className="text-gray-700 max-w-xl mx-auto mb-6 text-base sm:text-lg md:text-xl leading-relaxed">
            Explore career opportunities and become a part of a company
            dedicated to building a future where every employee thrives.
          </p>
          <button className="bg-primary hover:bg-purple-700 text-white text-lg sm:text-xl font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-200">
            Explore Careers
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
