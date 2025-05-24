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
      <Routes>
        <Route
          path="/"
          element={<HomePage blogRef={blogRef} reviewsRef={reviewsRef} />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/performance" element={<PerformancePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
