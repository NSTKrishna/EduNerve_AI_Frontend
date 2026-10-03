import { Navigate } from "react-router-dom";
import { useLearner } from "../context/LearnerContext";
import { PageLoading } from "./common/PageState";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useLearner();

  if (loading) return <PageLoading label="Checking your session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
