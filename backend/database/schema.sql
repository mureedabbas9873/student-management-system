-- Student Management System - Database schema
-- Run this file once in MySQL (see README for the exact command).

CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roll_no VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  course VARCHAR(100) NOT NULL,
  semester INT NOT NULL DEFAULT 1,
  gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data (optional)
INSERT IGNORE INTO students (roll_no, name, email, phone, course, semester, gender, address) VALUES
('CS-001', 'Ali Khan', 'ali.khan@example.com', '0300-1111111', 'BS Computer Science', 3, 'Male', 'Rawalpindi'),
('CS-002', 'Ayesha Noor', 'ayesha.noor@example.com', '0301-2222222', 'BS Computer Science', 5, 'Female', 'Islamabad'),
('SE-003', 'Usman Raza', 'usman.raza@example.com', '0302-3333333', 'BS Software Engineering', 1, 'Male', 'Lahore');
