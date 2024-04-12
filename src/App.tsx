import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { DashboardLayout, Navigation } from "./Navigation";
import {
  AuthProvider,
  FirestoreProvider,
  StorageProvider,
  useFirebaseApp,
} from "reactfire";
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
import { getStorage } from "firebase/storage";
import DashboardAuthorsPage from "./pages/Dashboard/Authors";
import { ProtectedRoutes } from "./Auth";

function CourseCompassApp() {
  const firebaseApp = useFirebaseApp();
  // initialize the sdks with the normal Firebase SDK functions
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>
        <StorageProvider sdk={storage}>
          <Routes>
            <Route path="/" element={<Navigation />}>
              <Route path="" element={<Home />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoutes>
                    {" "}
                    <ProfilePage />
                  </ProtectedRoutes>
                }
              />
              <Route path="/courses" element={<AllCoursesPage />} />
              <Route path="/courses/:courseId" element={<CoursePage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoutes>
                    <DashboardLayout />
                  </ProtectedRoutes>
                }
              >
                <Route path="" element={<RedirectToDashboardCoursesPage />} />
                <Route path="courses" element={<DashboardCoursesPage />} />
                <Route path="authors" element={<DashboardAuthorsPage />} />
                <Route path="reviews" element={<DashboardReviewsPage />} />
              </Route>
            </Route>
          </Routes>
        </StorageProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default CourseCompassApp;
