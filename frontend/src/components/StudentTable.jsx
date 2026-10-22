export default function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return <p className="empty">No students found.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Sem</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.roll_no}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone || "-"}</td>
              <td>{s.course}</td>
              <td>{s.semester}</td>
              <td>{s.gender}</td>
              <td className="actions">
                <button className="btn btn-edit" onClick={() => onEdit(s)}>Edit</button>
                <button className="btn btn-delete" onClick={() => onDelete(s)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
