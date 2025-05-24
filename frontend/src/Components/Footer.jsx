import React from 'react'
import { Twitter, Linkedin, Facebook } from 'lucide-react'
const Footer = () => {
return (
    <div className="w-full pt-24  bg-white flex flex-col space-y-5 items-center text-center">
      {/* Logo and Title */}
      <div className='flex flex-row items-center mb-6'>
        <img src="/nav.png" alt="CompanyGrow Logo" className="w-12 h-10 mb-2" />
      <h1 className="text-xl font-semibold mb-1">CompanyGrow</h1>
      </div>
      <p className="text-sm mb-6 text-gray-600">
        Stay updated on employee growth strategies
      </p>

      {/* Email Input & Subscribe Button */}
      <div className="flex flex-col sm:flex-row items-strech gap-2 mb-6">
        <input
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 sm:w-72"
        />
        <button className="bg-primary text-white px-5 py-2 rounded-md hover:bg-purple-700 transition">
          Subscribe
        </button>
      </div>

      {/* Footer Bottom Row */}
      <div className="flex justify-between w-full max-w-4xl px-6 py-16 text-gray-500 text-lg items-center">
        <button className="border px-3 py-1 rounded-md text-lg">English</button>
        <p>© 2023 CompanyGrow.</p>
        <div className="flex gap-4">
          <a href="https://x.com" className="hover:text-purple-600 transition">
            <Twitter size={24} />
          </a>
          <a href="https://linkedin.com" className="hover:text-purple-600 transition">
            <Linkedin size={24} />
          </a>
          <a href="https://facebook.com" className="hover:text-purple-600 transition">
            <Facebook size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer