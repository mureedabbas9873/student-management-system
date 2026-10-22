const pool = require("../config/db");

// Basic validation shared by create and update
function validate(body) {
  const errors = [];
  if (!body.roll_no || !body.roll_no.trim()) errors.push("Roll number is required");
  if (!body.name || !body.name.trim()) errors.push("Name is required");
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) errors.push("A valid email is required");
  if (!body.course || !body.course.trim()) errors.push("Course is required");
  const sem = Number(body.semester);
  if (!Number.isInteger(sem) || sem < 1 || sem > 12) errors.push("Semester must be between 1 and 12");
  return errors;
}

// GET /api/students?search=ali
exports.getStudents = async (req, res, next) => {
  try {
    const search = (req.query.search || "").trim();
    let sql = "SELECT * FROM students";
    const params = [];
    if (search) {
      sql += " WHERE name LIKE ? OR roll_no LIKE ? OR email LIKE ? OR course LIKE ?";
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }
    sql += " ORDER BY id DESC";
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/students/stats
exports.getStats = async (req, res, next) => {
  try {
    const [[total]] = await pool.query("SELECT COUNT(*) AS total FROM students");
    const [[courses]] = await pool.query("SELECT COUNT(DISTINCT course) AS courses FROM students");
    const [[male]] = await pool.query("SELECT COUNT(*) AS c FROM students WHERE gender = 'Male'");
    const [[female]] = await pool.query("SELECT COUNT(*) AS c FROM students WHERE gender = 'Female'");
    res.json({
      total: total.total,
      courses: courses.courses,
      male: male.c,
      female: female.c,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/:id
exports.getStudent = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /api/students
exports.createStudent = async (req, res, next) => {
  try {
    const errors = validate(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });

    const { roll_no, name, email, phone, course, semester, gender, address } = req.body;
    const [result] = await pool.query(
      "INSERT INTO students (roll_no, name, email, phone, course, semester, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [roll_no.trim(), name.trim(), email.trim(), phone || null, course.trim(), semester, gender || "Male", address || null]
    );
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/:id
exports.updateStudent = async (req, res, next) => {
  try {
    const errors = validate(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(", ") });

    const { roll_no, name, email, phone, course, semester, gender, address } = req.body;
    const [result] = await pool.query(
      "UPDATE students SET roll_no = ?, name = ?, email = ?, phone = ?, course = ?, semester = ?, gender = ?, address = ? WHERE id = ?",
      [roll_no.trim(), name.trim(), email.trim(), phone || null, course.trim(), semester, gender || "Male", address || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/students/:id
exports.deleteStudent = async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM students WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    next(err);
  }
};
