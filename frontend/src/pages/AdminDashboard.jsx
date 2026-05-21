import { useState, useEffect } from "react";
import api from "../api";

// empty form state for adding a new course
const emptyCourse = { title: "", description: "", instructor: "", schedule: "", capacity: "" };

function AdminDashboard() {
  const [tab, setTab] = useState("courses"); // "courses" or "registrations"
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [newCourse, setNewCourse] = useState(emptyCourse);
  const [editingCourse, setEditingCourse] = useState(null); // course being edited (or null)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCourses();
    loadRegistrations();
  }, []);

  function loadCourses() {
    api.get("courses/").then((res) => setCourses(res.data));
  }

  function loadRegistrations() {
    api.get("admin/registrations/").then((res) => setRegistrations(res.data));
  }

  function handleNewCourseChange(e) {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  }

  function handleEditChange(e) {
    setEditingCourse({ ...editingCourse, [e.target.name]: e.target.value });
  }

  async function handleCreateCourse(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("courses/", newCourse);
      setSuccess("Course created!");
      setNewCourse(emptyCourse);
      loadCourses();
    } catch (err) {
      setError("Failed to create course. Check all fields.");
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.put(`courses/${editingCourse.id}/`, editingCourse);
      setSuccess("Course updated!");
      setEditingCourse(null);
      loadCourses();
    } catch (err) {
      setError("Failed to update course.");
    }
  }

  async function handleDeleteCourse(id) {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setError("");
    setSuccess("");
    try {
      await api.delete(`courses/${id}/`);
      setSuccess("Course deleted!");
      loadCourses();
    } catch (err) {
      setError("Failed to delete course.");
    }
  }

  async function handleUpdateStatus(regId, newStatus) {
    setError("");
    setSuccess("");
    try {
      await api.put(`admin/registrations/${regId}/`, { status: newStatus });
      setSuccess(`Registration ${newStatus}.`);
      loadRegistrations();
    } catch (err) {
      setError("Failed to update registration.");
    }
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      {error   && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {/* Tab buttons */}
      <div className="tabs">
        <button className={`tab ${tab === "courses" ? "active" : ""}`} onClick={() => setTab("courses")}>
          Courses
        </button>
        <button className={`tab ${tab === "registrations" ? "active" : ""}`} onClick={() => setTab("registrations")}>
          Registrations
        </button>
      </div>

      {/* ── COURSES TAB ── */}
      {tab === "courses" && (
        <div>
          {/* Add new course */}
          <div className="card">
            <h2>Add New Course</h2>
            <form onSubmit={handleCreateCourse}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Title</label>
                  <input name="title" value={newCourse.title} onChange={handleNewCourseChange} required />
                </div>
                <div className="form-group">
                  <label>Instructor</label>
                  <input name="instructor" value={newCourse.instructor} onChange={handleNewCourseChange} required />
                </div>
                <div className="form-group">
                  <label>Schedule</label>
                  <input name="schedule" value={newCourse.schedule} onChange={handleNewCourseChange} required placeholder="e.g. Mon/Wed 10am–11am" />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" name="capacity" value={newCourse.capacity} onChange={handleNewCourseChange} required min="1" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={newCourse.description} onChange={handleNewCourseChange} rows="3" required />
              </div>
              <button type="submit" className="btn btn-primary">Add Course</button>
            </form>
          </div>

          {/* Edit course form — only shown when a course is being edited */}
          {editingCourse && (
            <div className="card">
              <h2>Edit Course</h2>
              <form onSubmit={handleSaveEdit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label>Title</label>
                    <input name="title" value={editingCourse.title} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Instructor</label>
                    <input name="instructor" value={editingCourse.instructor} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Schedule</label>
                    <input name="schedule" value={editingCourse.schedule} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <input type="number" name="capacity" value={editingCourse.capacity} onChange={handleEditChange} required min="1" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={editingCourse.description} onChange={handleEditChange} rows="3" required />
                </div>
                <div className="row">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingCourse(null)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Courses table */}
          <div className="card">
            <h2>All Courses ({courses.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Schedule</th>
                  <th>Seats</th>
                  <th>Accepted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>{course.instructor}</td>
                    <td>{course.schedule}</td>
                    <td>{course.seats_available}/{course.capacity}</td>
                    <td>{course.enrolled_count}</td>
                    <td>
                      <div className="row">
                        <button className="btn btn-warning" onClick={() => setEditingCourse(course)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── REGISTRATIONS TAB ── */}
      {tab === "registrations" && (
        <div className="card">
          <h2>All Registrations ({registrations.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.user.username}</td>
                  <td>{reg.course.title}</td>
                  <td>{new Date(reg.registered_at).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${reg.status}`}>{reg.status}</span></td>
                  <td>
                    <div className="row">
                      {reg.status !== "accepted" && (
                        <button className="btn btn-success" onClick={() => handleUpdateStatus(reg.id, "accepted")}>
                          Accept
                        </button>
                      )}
                      {reg.status !== "rejected" && (
                        <button className="btn btn-danger" onClick={() => handleUpdateStatus(reg.id, "rejected")}>
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
