# Student Management System

A beginner-friendly full-stack project using React.js, Node.js, Express.js, and MySQL.

## Features
- Add, view, edit, and delete student records (CRUD)
- Search students by name, email, or course
- Dashboard cards showing total students and courses
- Responsive interface

## Requirements
- Node.js (LTS)
- MySQL Server (or XAMPP MySQL)
- VS Code (recommended)

## 1. Create the database
Open MySQL Workbench or phpMyAdmin and run the SQL in `database/schema.sql`.

This creates the `student_management` database and `students` table.

## 2. Configure the backend
Open a terminal in the `backend` folder and run:

```powershell
npm install
```

Copy `.env.example` to `.env`, then edit the values to match your MySQL setup:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=student_management
```

If your MySQL root account has a password, enter it as `DB_PASSWORD`.

Start the backend:

```powershell
npm run dev
```

The API will run at `http://localhost:5000`.

## 3. Configure the frontend
Open a second terminal in the `frontend` folder and run:

```powershell
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## API endpoints
- `GET /api/students` — list students
- `GET /api/students/:id` — get one student
- `POST /api/students` — add student
- `PUT /api/students/:id` — update student
- `DELETE /api/students/:id` — delete student
- `GET /api/health` — check API status

## Notes
- This is an educational starter project, not a production-ready system.
- Add authentication, authorization, validation, and secure deployment before using real student data.
- Only claim features you have actually implemented and tested in any scholarship or CV application.
