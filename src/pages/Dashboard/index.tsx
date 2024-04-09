import { Navigate } from "react-router-dom";
import DashboardCoursesPage from "./Courses";
import DashboardReviewsPage from "./Reviews";

export { DashboardCoursesPage, DashboardReviewsPage };

export function RedirectToDashboardCoursesPage() {
  return <Navigate to={`courses`} replace />;
}
