import subprocess

# Start Django backend in background
backend_cmd = "bash -c 'cd carwash_api && source .venv/bin/activate && python manage.py runserver'"
backend_process = subprocess.Popen(backend_cmd, shell=True)

# Start frontend (bun run dev)
frontend_cmd = "bash -c 'cd carwash_frontend && bun run dev'"
frontend_process = subprocess.Popen(frontend_cmd, shell=True)

# Optional: Wait for both to finish (Ctrl+C to stop)
try:
    backend_process.wait()
    frontend_process.wait()
except KeyboardInterrupt:
    print("Stopping servers...")
    backend_process.terminate()
    frontend_process.terminate()
