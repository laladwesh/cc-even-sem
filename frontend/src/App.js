import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRef } from "react";
import HomePage from "./pages/HomePage";
import Navbar from "./Components/Navbar";
import AboutPage from "./pages/AboutPage";
import Footer from "./Components/Footer";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CoursePage from "./pages/CoursePage";
import ProjectPage from "./pages/ProjectPage";
import PerformancePage from "./pages/PerformancePage";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./utils/AdminRoute";
import { Toaster } from 'react-hot-toast';

function App() {
  const blogRef = useRef(null);
  const reviewsRef = useRef(null);

  const scrollTo = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <BrowserRouter>
      <Navbar
        onBlogClick={() => scrollTo(blogRef)}
        onReviewsClick={() => scrollTo(reviewsRef)}
      />
    <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={<HomePage blogRef={blogRef} reviewsRef={reviewsRef} />}
        />
        <Route
          path="/about"
          element={
              <AboutPage />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/performance"
          element={
            <ProtectedRoute>
              <PerformancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
