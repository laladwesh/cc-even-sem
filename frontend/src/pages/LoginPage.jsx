import React, { useState, useEffect } from "react";
import {
  SignIn,
  SignUp,
  useAuth,
  SignedOut,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left side with image and text (visible on lg+) */}
      <div className="hidden lg:flex lg:w-1/3 relative bg-black">
        <img
          src="team.png"
          alt="Team celebrating"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 mx-auto mb-16 px-6 sm:px-10 text-white text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug">
          Where amazing
          <br />
          things happen
        </div>
      </div>

      {/* Right side with Clerk auth forms */}
      <div className="w-full lg:w-2/3 flex items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-md">
          <SignedOut>
            {showSignUp ? (
              <SignUp
                appearance={{
                  elements: {
                    card: "shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 rounded-2xl",
                    headerTitle: "text-center text-xl font-semibold",
                    headerSubtitle: "text-center text-gray-500 text-sm mb-6",
                    logoImage: "h-10 mx-auto mb-3",
                    socialButtonsBlockButton:
                      "w-full flex items-center justify-center py-2 text-sm font-semibold rounded-md transition mb-3",
                    socialButtonsBlockButton__google:
                      "bg-[#DB4437] text-white hover:bg-[#c63c31]",
                    socialButtonsBlockButton__facebook:
                      "bg-[#1877F2] text-white hover:bg-[#166fe5]",
                    dividerRow: "my-4",
                    dividerLine: "bg-gray-300",
                    dividerText: "text-gray-500 text-xs",
                    formFieldLabel: "text-sm font-medium text-gray-700 mb-1",
                    formFieldInput:
                      "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                    formButtonPrimary:
                      "w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-md transition mt-4",
                    footerActionText: "text-sm text-gray-600 text-center mt-4",
                    footerActionLink: "text-purple-600 hover:underline",
                  },
                  variables: {
                    colorPrimary: "#7C3AED",
                    fontFamily: "Inter, sans-serif",
                  },
                }}
                redirectUrl="/dashboard"
              />
            ) : (
              <SignIn
                appearance={{
                  elements: {
                    card: "shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 rounded-2xl",
                    headerTitle: "text-center text-xl font-semibold",
                    headerSubtitle: "text-center text-gray-500 text-sm mb-6",
                    logoImage: "h-10 mx-auto mb-3",
                    socialButtonsBlockButton:
                      "w-full flex items-center justify-center py-2 text-sm font-semibold rounded-md transition mb-3",
                    socialButtonsBlockButton__google:
                      "bg-[#DB4437] text-white hover:bg-[#c63c31]",
                    socialButtonsBlockButton__facebook:
                      "bg-[#1877F2] text-white hover:bg-[#166fe5]",
                    dividerRow: "my-4",
                    dividerLine: "bg-gray-300",
                    dividerText: "text-gray-500 text-xs",
                    formFieldLabel: "text-sm font-medium text-gray-700 mb-1",
                    formFieldInput:
                      "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
                    formButtonPrimary:
                      "w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-md transition mt-4",
                    footerActionText: "text-sm text-gray-600 text-center mt-4",
                    footerActionLink: "text-purple-600 hover:underline",
                  },
                  variables: {
                    colorPrimary: "#7C3AED",
                    fontFamily: "Inter, sans-serif",
                  },
                }}
                redirectUrl="/dashboard"
              />
            )}

            {/* Toggle SignIn and SignUp */}
            <div className="text-center mt-4">
              {showSignUp ? (
                <p className="text-gray-500 text-sm">
                  Already have an account?{" "}
                  <span
                    className="text-[#38bdf8] cursor-pointer hover:underline"
                    onClick={() => setShowSignUp(false)}
                  >
                    Sign In
                  </span>
                </p>
              ) : (
                <p className="text-gray-500 text-sm">
                  Don’t have an account?{" "}
                  <span
                    className="text-[#38bdf8] cursor-pointer hover:underline"
                    onClick={() => setShowSignUp(true)}
                  >
                    Sign Up
                  </span>
                </p>
              )}
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
