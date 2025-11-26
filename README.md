# Dom Care Connect

Dom Care Connect is a web application for dormitory maintenance requests. It provides a modern, responsive front-end UI built with React and Vite and uses a small in-browser mock API (localStorage) so you can run and test the full user/admin experience without a backend.

This README explains how the app works, what features it offers, how to run it locally, the structure of the mock API, and recommended next steps for production hardening.

---

## Key features

- Role-based access: Users and Admins have different views and permissions.
- Users can: register/login (mock), create maintenance reports (title, category, description, room/address, contact), view and edit their own reports, add comments, search their reports.
- Admins can: login (mock), view an admin dashboard with status summaries, search and filter reports, open any report, comment, change status (Open / In Progress / Resolved), edit or delete any report.
- Comments can be added to reports. Comment deletion is allowed for the comment author or for admins.
- All data persists locally in the browser using `localStorage` so you can experiment without a backend.

---

## Architecture & important files

- Front-end: React + Vite (see `src/`)
- Routing: `react-router-dom`
- Authentication: client-side role stored in `localStorage` via `AuthContext`
- In-browser mock API: `src/services/mockApi.js` (CRUD operations stored under localStorage key `dcc_mock`)

Key source files
- `src/App.jsx` — application routes and layout
- `src/contexts/AuthContext.jsx` — login/logout and user state
- `src/services/mockApi.js` — mock API (login, create/list/get/update/delete reports, add/delete comments)
- `src/components/Navbar.jsx` — top navigation (shows logged-in user and logout)
- `src/components/ProtectedRoute.jsx` — route guard for role-based pages
- `src/pages/` — page components: `Login.jsx`, `Reports.jsx`, `ReportForm.jsx`, `ReportDetail.jsx`, `EditReport.jsx`, `AdminDashboard.jsx`
- `src/index.css` — global styles and theme (navy-blue primary color)

---

## Data and mock API

The mock API persists data under the `localStorage` key `dcc_mock` and exposes these methods:

- `login({email, password})` → returns `{id,name,email,role}` or throws.  
- `createReport(report)` → returns new report object.  
- `listReports(filter)` → supports `{ ownerId, search, status }`.  
- `getReport(id)` → returns a report by id.  
- `updateReport(id, patch)` → partial update.  
- `deleteReport(id)` → deletes report (returns success boolean).  
- `addComment(reportId, comment)` → adds `{id,author,text,authorId,createdAt}`.  
- `deleteComment(reportId, commentId)` → deletes comment (returns success boolean).

Each `report` object contains fields such as:
`id, title, category, description, ownerId, ownerName, roomNumber, contact, status, comments[], createdAt`.

Demo users are pre-seeded in the mock data (see `mockApi.js`).

---

## Demo credentials

- User: `user@example.com` / `password`  (role: `user`)  
- Admin: `admin@example.com` / `admin`  (role: `admin`)

Use these to test user- and admin-specific flows.

---


