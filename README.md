Here's a **short and clear `README.md`** you can use for your project, with a **single-terminal quickstart**:

# Carwash App

A full-stack carwash platform with:

- 🧼 Django REST API (JWT-authenticated)
- 🌐 Next.js frontend (with Bun)
- 🔐 Admin interface and custom user roles (ADMIN, STAFF, CUSTOMER)

## 🔧 Quickstart (Linux/macOS)

```bash
# Clone and enter the project
git clone https://github.com/Georgefemiwise/carwash_api.git
cd carwash_api

# Start backend (Django API)
cd carwash_api
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
````

Open a **new terminal** for frontend:

```bash
# Start frontend (Next.js with Bun)
cd carwash_frontend
bun install
bun run dev
```

## 🧪 API Endpoints

* `POST /api/register/` – Register user
* `POST /api/token/` – Get JWT token
* `GET /api/me/` – Get current user (authenticated)
* `http://localhost:8000/admin/` – Admin panel


```
## ⚡ Bonus: Auto start both

Run this script to auto-launch both (Linux only):

```python
python3 run_project.py
```

