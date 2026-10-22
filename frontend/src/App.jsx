import { useEffect, useMemo, useState } from 'react';
import { Users, GraduationCap, Search, Plus, Pencil, Trash2, X, BookOpen, Menu, RefreshCw } from 'lucide-react';

const API = 'http://localhost:5000/api';
const emptyForm = { full_name: '', email: '', course: 'Computer Science', semester: '1', phone: '' };

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadStudents(query = search) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API}/students?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load students');
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Could not connect to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStudents(''); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadStudents(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const courseCount = useMemo(() => new Set(students.map(s => s.course)).size, [students]);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setNotice('');
  }

  function startEdit(student) {
    setEditingId(student.id);
    setForm({
      full_name: student.full_name,
      email: student.email,
      course: student.course,
      semester: String(student.semester),
      phone: student.phone || ''
    });
    setShowForm(true);
    setNotice('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    try {
      const response = await fetch(editingId ? `${API}/students/${editingId}` : `${API}/students`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, semester: Number(form.semester) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save student');
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? 'Student updated successfully.' : 'Student added successfully.');
      await loadStudents(search);
    } catch (err) {
      setError(err.message || 'Could not save student');
    }
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.full_name}? This cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      const response = await fetch(`${API}/students/${student.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not delete student');
      setNotice('Student deleted successfully.');
      await loadStudents(search);
    } catch (err) {
      setError(err.message || 'Could not delete student');
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon"><GraduationCap size={23} /></div><div><strong>CampusDesk</strong><span>STUDENT PORTAL</span></div></div>
        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active"><Users size={18} /> Student Records</div>
        <div className="nav-item"><BookOpen size={18} /> Courses</div>
        <div className="sidebar-bottom"><div className="avatar">AD</div><div><strong>Administrator</strong><span>Local demo account</span></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><Menu size={20}/><strong>CampusDesk</strong></div>
          <div className="breadcrumb">Workspace <span>/</span> <strong>Student Records</strong></div>
          <div className="topbar-right"><span className="status-dot"></span> Local environment</div>
        </header>

        <section className="page">
          <div className="page-heading">
            <div><div className="eyebrow">OVERVIEW</div><h1>Student Management</h1><p>Manage student records from one simple dashboard.</p></div>
            <button className="primary-btn" onClick={startAdd}><Plus size={18}/> Add student</button>
          </div>

          {error && <div className="alert error-alert"><span>{error}</span><button onClick={() => loadStudents()} aria-label="Retry"><RefreshCw size={16}/> Retry</button></div>}
          {notice && <div className="alert success-alert">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={16}/></button></div>}

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon blue"><Users size={21}/></div><div><span>Total students</span><strong>{students.length}</strong><small>Records in current view</small></div></div>
            <div className="stat-card"><div className="stat-icon purple"><GraduationCap size={21}/></div><div><span>Courses represented</span><strong>{courseCount}</strong><small>Unique courses in current view</small></div></div>
            <div className="stat-card"><div className="stat-icon green"><BookOpen size={21}/></div><div><span>System status</span><strong className="online-text">{error ? 'Offline' : loading ? 'Loading' : 'Ready'}</strong><small>Connected to student API</small></div></div>
          </div>

          <section className="table-card">
            <div className="table-heading"><div><h2>Student records</h2><p>View, search, edit, or remove student information.</p></div><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." aria-label="Search students"/></div></div>
            <div className="table-wrap">
              <table><thead><tr><th>STUDENT</th><th>COURSE</th><th>SEMESTER</th><th>PHONE</th><th>ACTIONS</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan="5" className="empty-state">Loading student records…</td></tr> :
                   students.length === 0 ? <tr><td colSpan="5" className="empty-state">{error ? 'Start the backend and check your database settings.' : 'No students found. Add your first student to get started.'}</td></tr> :
                   students.map(student => <tr key={student.id}>
                    <td><div className="student-cell"><div className="student-avatar">{student.full_name.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase()}</div><div><strong>{student.full_name}</strong><span>{student.email}</span></div></div></td>
                    <td><span className="course-pill">{student.course}</span></td><td><span className="semester-pill">Semester {student.semester}</span></td><td>{student.phone || '—'}</td>
                    <td><div className="actions"><button className="icon-btn edit-btn" title="Edit student" onClick={() => startEdit(student)}><Pencil size={16}/></button><button className="icon-btn delete-btn" title="Delete student" onClick={() => deleteStudent(student)}><Trash2 size={16}/></button></div></td>
                   </tr>)}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{students.length}</strong> record(s)</span><button className="refresh-btn" onClick={() => loadStudents()}><RefreshCw size={14}/> Refresh</button></div>
          </section>
          <footer>CampusDesk Student Management System <span>•</span> Built with React & Node.js</footer>
        </section>
      </main>

      {showForm && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-heading"><div><div className="eyebrow">{editingId ? 'UPDATE RECORD' : 'NEW RECORD'}</div><h2 id="modal-title">{editingId ? 'Edit student' : 'Add a student'}</h2><p>Enter the student information below.</p></div><button className="icon-btn" onClick={() => setShowForm(false)} aria-label="Close"><X size={20}/></button></div>
          <form onSubmit={handleSubmit} className="student-form">
            <label>Full name<input required maxLength="120" value={form.full_name} onChange={e => setForm({...form, full_name:e.target.value})} placeholder="e.g. Ali Khan"/></label>
            <label>Email address<input required type="email" maxLength="160" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="student@example.com"/></label>
            <div className="form-row"><label>Course<select value={form.course} onChange={e => setForm({...form, course:e.target.value})}><option>Computer Science</option><option>Software Engineering</option><option>Information Technology</option><option>Data Science</option><option>Cybersecurity</option><option>Other</option></select></label>
              <label>Semester<select value={form.semester} onChange={e => setForm({...form, semester:e.target.value})}>{Array.from({length:12}, (_,i) => <option key={i+1} value={i+1}>{i+1}</option>)}</select></label></div>
            <label>Phone number <span className="optional">(optional)</span><input maxLength="30" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="03xx xxxxxxx"/></label>
            <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-btn">{editingId ? 'Save changes' : 'Add student'}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

export default App;
