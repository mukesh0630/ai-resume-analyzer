import sys
sys.path.append(r'D:/ai-resume-analyzer')
from backend.app import main
for r in main.app.router.routes:
    methods = getattr(r, 'methods', None)
    path = getattr(r, 'path', None)
    print(f"{methods} {path}")
