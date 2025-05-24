import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';

export default function Navbar({ onBlogClick, onReviewsClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = useUser();
  console.log(user.user);
  return (
    <nav className="w-full px-4 md:px-10 py-3 flex items-center justify-between shadow-sm bg-white fixed top-0 z-50">
      {/* Logo */}
      <Link to="/">
      <div className="flex items-center">
        <img src='/nav.png' alt="logo" className="w-12 h-10 rounded-full" />
        <span className="font-semibold text-lg">
          Company<span className="text-purple-600">Grow</span>
        </span>
      </div>
      </Link>

      {/* Desktop Nav */}
      {/* Desktop Nav */}
<div className="hidden md:flex items-center space-x-6 text-lg text-gray-700 font-medium">
  <SignedOut>
    <ul className="flex items-center space-x-6">
      <li className="hover:text-primary cursor-pointer">
        <button onClick={onBlogClick}>Blog</button>
      </li>
      <li className="hover:text-primary cursor-pointer">
        <button onClick={onReviewsClick}>Our Reviews</button>
      </li>
      <li className="hover:text-primary cursor-pointer">
        <button onClick={() => navigate('/about')}>About Us</button>
      </li>
    </ul>
  </SignedOut>

  <SignedIn>
    <ul className="flex items-center space-x-6">
      <li className="hover:text-purple-600 cursor-pointer">
        <button onClick={() => navigate('/dashboard')}>
          Training Dashboard
        </button>
      </li>
      <li className="hover:text-purple-600 cursor-pointer">
        <button onClick={() => navigate('/project')}>
          Project Allocation
        </button>
      </li>
      <li className="hover:text-purple-600 cursor-pointer">
        <button onClick={() => navigate('/performance')}>
          Performance Reward
        </button>
      </li>
    </ul>
  </SignedIn>
</div>


      {/* Sign In Button */}
      <div className="hidden md:block">
        <SignedOut>
        <button onClick={() => navigate('/login')} className="px-4 py-1.5 border border-primary text-primary rounded-md hover:bg-primary/10 transition">
          Sign In
        </button>
        </SignedOut>
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white border-t border-gray-100 shadow-md md:hidden">
          <ul className="flex flex-col p-4 space-y-3 text-gray-700">
            <li className="hover:text-purple-600 cursor-pointer">Blog</li>
            <li className="hover:text-purple-600 cursor-pointer">Our Reviews</li>
            <li className="hover:text-purple-600 cursor-pointer">About Us</li>
            <li>
              <button className="w-full text-left px-4 py-2 mt-2 border border-purple-500 text-purple-600 rounded-md hover:bg-purple-50 transition">
                Sign In
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
