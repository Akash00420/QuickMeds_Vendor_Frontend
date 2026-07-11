import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <div className="not-found-icon">💊</div>
      <div className="not-found-title">404 — Page Not Found</div>
      <div className="not-found-sub">This page doesn't exist in the vendor dashboard.</div>
      <button className="btn btn-primary mt-4" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;