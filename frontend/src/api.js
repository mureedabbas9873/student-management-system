// All backend calls live here, so components stay clean.
// If you change the backend port, change it here too.
const BASE_URL = "http://localhost:5000/api/students";

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const getStudents = (search = "") =>
  request(`${BASE_URL}?search=${encodeURIComponent(search)}`);

export const getStats = () => request(`${BASE_URL}/stats`);

export const createStudent = (student) =>
  request(BASE_URL, { method: "POST", body: JSON.stringify(student) });

export const updateStudent = (id, student) =>
  request(`${BASE_URL}/${id}`, { method: "PUT", body: JSON.stringify(student) });

export const deleteStudent = (id) => request(`${BASE_URL}/${id}`, { method: "DELETE" });
