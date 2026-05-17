import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("courses/")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Loading courses...</div>;

  return (
    <div className="container">
      <h1>Available Courses</h1>

      {courses.length === 0 && (
        <div className="card">No courses available yet.</div>
      )}

      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>

            <div className="course-meta">
              <p>Instructor: {course.instructor}</p>
              <p>Schedule: {course.schedule}</p>
              <p>
                Seats:{" "}
                <span style={{ color: course.seats_available > 0 ? "#16a34a" : "#dc2626", fontWeight: "600" }}>
                  {course.seats_available}/{course.capacity} left
                </span>
              </p>
            </div>

            <p style={{ fontSize: "13px", color: "#4b5563", margin: "10px 0 14px" }}>
              {course.description.length > 100
                ? course.description.slice(0, 100) + "..."
                : course.description}
            </p>

            <Link to={`/courses/${course.id}`}>
              <button className="btn btn-primary">View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;
