import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get(`courses/${id}/`)
      .then((res) => setCourse(res.data))
      .catch(() => setError("Course not found."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleEnroll() {
    if (!token) {
      navigate("/login");
      return;
    }
    setError("");
    setMessage("");
    try {
      await api.post(`courses/${id}/enroll/`);
      setMessage("Enrolled successfully! Your registration is pending approval.");
    } catch (err) {
      setError(err.response?.data?.error || "Enrollment failed.");
    }
  }

  if (loading) return <div className="container">Loading...</div>;
  if (!course)  return <div className="container"><div className="error-msg">{error}</div></div>;

  return (
    <div className="container">
      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "16px" }}
      >
        ← Back
      </button>

      <div className="card">
        <h1>{course.title}</h1>

        {message && <div className="success-msg">{message}</div>}
        {error   && <div className="error-msg">{error}</div>}

        {/* Course info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "16px 0" }}>
          <div>
            <p style={{ fontWeight: "600", marginBottom: "4px" }}>Instructor</p>
            <p>{course.instructor}</p>
          </div>
          <div>
            <p style={{ fontWeight: "600", marginBottom: "4px" }}>Schedule</p>
            <p>{course.schedule}</p>
          </div>
          <div>
            <p style={{ fontWeight: "600", marginBottom: "4px" }}>Total Capacity</p>
            <p>{course.capacity} seats</p>
          </div>
          <div>
            <p style={{ fontWeight: "600", marginBottom: "4px" }}>Seats Available</p>
            <p style={{ color: course.seats_available > 0 ? "#16a34a" : "#dc2626", fontWeight: "600" }}>
              {course.seats_available}/{course.capacity} left
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: "600", marginBottom: "8px" }}>Description</p>
          <p style={{ lineHeight: "1.6", color: "#4b5563" }}>{course.description}</p>
        </div>

        {course.seats_available > 0 ? (
          <button className="btn btn-primary" onClick={handleEnroll}>
            {token ? "Enroll Now" : "Login to Enroll"}
          </button>
        ) : (
          <button className="btn btn-secondary" disabled>
            Course is Full
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
