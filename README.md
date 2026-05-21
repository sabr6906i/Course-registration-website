# Course Registration Portal

A full-stack web app with a Django REST Framework backend and React frontend.

## Project Structure

```

├── Coursereg/       ← Django backend
└── frontend/        ← React frontend
```

---

## Setup & Running

### 1. Backend (Django)

Open a terminal in the `Coursereg/` folder.

**Install packages** (only needed once):
```bash
pip install djangorestframework djangorestframework-simplejwt django-cors-headers
```

**Run migrations** (only needed once):
```bash
python manage.py migrate
```

**Create an admin user** (only needed once):
```bash
python manage.py createsuperuser
```
Enter a username and password when prompted. This user will have admin access in the portal.

**Start the backend server:**
```bash
python manage.py runserver
```
Backend runs at: http://localhost:8000

---

### 2. Frontend (React)

Open a **second terminal** in the `frontend/` folder.

**Install packages** (only needed once):
```bash
npm install
```

**Start the frontend:**
```bash
npm run dev
```
Frontend runs at: http://localhost:5173

---

## API Endpoints

| Method | URL | Who can use it |
|--------|-----|----------------|
| POST | `/api/register/` | Anyone — create account |
| POST | `/api/token/` | Anyone — login (returns JWT) |
| GET | `/api/me/` | Logged-in user |
| GET | `/api/courses/` | Anyone |
| GET | `/api/courses/<id>/` | Anyone |
| POST | `/api/courses/` | Admin only |
| PUT | `/api/courses/<id>/` | Admin only |
| DELETE | `/api/courses/<id>/` | Admin only |
| POST | `/api/courses/<id>/enroll/` | Logged-in user |
| GET | `/api/my-registrations/` | Logged-in user |
| GET | `/api/admin/registrations/` | Admin only |
| PUT | `/api/admin/registrations/<id>/` | Admin only |

---

## Features

**Public users:**
- View all courses (no login required)
- View individual course details
- Register an account and log in

**Logged-in users:**
- Enroll in any course with available seats
- View their own registrations and see status (pending / accepted / rejected)

**Admin users:**
- Add, edit, and delete courses
- View all student registrations
- Accept or reject individual registrations
