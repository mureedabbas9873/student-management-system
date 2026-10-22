const express = require("express");
const router = express.Router();
const c = require("../controllers/studentController");

// NOTE: "/stats" must come before "/:id", otherwise Express treats "stats" as an id
router.get("/stats", c.getStats);
router.get("/", c.getStudents);
router.get("/:id", c.getStudent);
router.post("/", c.createStudent);
router.put("/:id", c.updateStudent);
router.delete("/:id", c.deleteStudent);

module.exports = router;
