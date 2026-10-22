CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  course VARCHAR(120) NOT NULL,
  semester TINYINT UNSIGNED NOT NULL,
  phone VARCHAR(30) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional sample records for testing:
INSERT IGNORE INTO students (full_name, email, course, semester, phone) VALUES
('Ali Khan', 'ali@example.com', 'Computer Science', 5, '03001234567'),
('Sara Ahmed', 'sara@example.com', 'Software Engineering', 3, '03007654321');
