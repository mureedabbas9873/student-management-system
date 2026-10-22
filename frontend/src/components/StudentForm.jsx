import { useEffect, useState } from "react";

const emptyForm = {
  roll_no: "",
  name: "",
  email: "",
  phone: "",
  course: "",
  semester: 1,
  gender: "Male",
  address: "",
};

// Used for both "Add" and "Edit". If `student` is passed, it is edit mode.
export default function StudentForm({ student, onSave, onCancel, saving }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(student ? { ...emptyForm, ...student } : emptyForm);
  }, [student]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, semester: Number(form.semester) });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{student ? "Edit Student" : "Add New Student"}</h2>

      <div className="grid">
        <label>
          Roll No *
          <input name="roll_no" value={form.roll_no} onChange={handleChange} required />
        </label>
        <label>
          Full Name *
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email *
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone || ""} onChange={handleChange} />
        </label>
        <label>
          Course *
          <input name="course" value={form.course} onChange={handleChange} required />
        </label>
        <label>
          Semester *
          <input type="number" min="1" max="12" name="semester" value={form.semester} onChange={handleChange} required />
        </label>
        <label>
          Gender
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Address
          <input name="address" value={form.address || ""} onChange={handleChange} />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : student ? "Update Student" : "Add Student"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
