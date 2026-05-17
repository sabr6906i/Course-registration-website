import { useState, useEffect } from "react";
import api from "../api";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("my-registrations/")
      .then((res) => setRegistrations(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>My Registrations</h1>

      {registrations.length === 0 && (
        <div className="card">You have not registered for any courses yet.</div>
      )}

      {registrations.map((reg) => (
        <div key={reg.id} className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
                {reg.course.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>Instructor: {reg.course.instructor}</p>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>Schedule: {reg.course.schedule}</p>
              <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                Registered on: {new Date(reg.registered_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`badge badge-${reg.status}`}>{reg.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyRegistrations;
