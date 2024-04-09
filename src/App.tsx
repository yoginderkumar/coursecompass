import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { DashboardLayout, Navigation } from "./Navigation";
import { AuthProvider, FirestoreProvider, useFirebaseApp } from "reactfire";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import CoursePage from "./pages/Course";
import ProfilePage from "./pages/Profile";
import {
  DashboardCoursesPage,
  DashboardReviewsPage,
  RedirectToDashboardCoursesPage,
} from "./pages/Dashboard";
import AllCoursesPage from "./pages/AllCourses";

function CourseCompassApp() {
  const firebaseApp = useFirebaseApp();
  // initialize the sdks with the normal Firebase SDK functions
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>
        <Routes>
          <Route path="/" element={<Navigation />}>
            <Route path="" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/courses" element={<AllCoursesPage />} />
            <Route path="/courses/:courseId" element={<CoursePage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="" element={<RedirectToDashboardCoursesPage />} />
              <Route path="courses" element={<DashboardCoursesPage />} />
              <Route path="reviews" element={<DashboardReviewsPage />} />
            </Route>
          </Route>
        </Routes>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default CourseCompassApp;
