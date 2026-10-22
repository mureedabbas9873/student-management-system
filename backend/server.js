const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const fields = ['full_name', 'email', 'course', 'semester', 'phone'];

function validateStudent(body) {
  const full_name = String(body.full_name || '').trim();
  const email = String(body.email || '').trim();
  const course = String(body.course || '').trim();
  const semester = Number(body.semester);
  const phone = String(body.phone || '').trim();

  if (!full_name || !email || !course || !Number.isInteger(semester) || semester < 1 || semester > 12) {
    return { error: 'Name, email, course, and a semester from 1 to 12 are required.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }
  return { student: { full_name, email, course, semester, phone } };
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Student API is running' }));

app.get('/api/students', async (req, res) => {
  try {
    const search = String(req.query.search || '').trim();
    const [rows] = await pool.execute(
      `SELECT id, full_name, email, course, semester, phone, created_at
       FROM students
       WHERE full_name LIKE ? OR email LIKE ? OR course LIKE ?
       ORDER BY id DESC`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load students. Check your database setup.' });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, course, semester, phone FROM students WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Student not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load this student.' });
  }
});

app.post('/api/students', async (req, res) => {
  const result = validateStudent(req.body);
  if (result.error) return res.status(400).json({ error: result.error });

  try {
    const s = result.student;
    const [insert] = await pool.execute(
      'INSERT INTO students (full_name, email, course, semester, phone) VALUES (?, ?, ?, ?, ?)',
      [s.full_name, s.email, s.course, s.semester, s.phone]
    );
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, course, semester, phone, created_at FROM students WHERE id = ?',
      [insert.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'That email is already registered.' });
    console.error(err);
    res.status(500).json({ error: 'Could not add student.' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  const result = validateStudent(req.body);
  if (result.error) return res.status(400).json({ error: result.error });

  try {
    const s = result.student;
    const [update] = await pool.execute(
      'UPDATE students SET full_name = ?, email = ?, course = ?, semester = ?, phone = ? WHERE id = ?',
      [s.full_name, s.email, s.course, s.semester, s.phone, req.params.id]
    );
    if (!update.affectedRows) return res.status(404).json({ error: 'Student not found.' });
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, course, semester, phone FROM students WHERE id = ?',
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'That email is already used by another student.' });
    console.error(err);
    res.status(500).json({ error: 'Could not update student.' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Student not found.' });
    res.json({ message: 'Student deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete student.' });
  }
});

app.listen(PORT, () => console.log(`Student API running at http://localhost:${PORT}`));
