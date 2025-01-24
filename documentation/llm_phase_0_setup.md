# Phase 0 (Flattened Checklist)

[x] BACKEND: Install Node.js (v16+ recommended) and confirm by running "node -v".  
[x] BACKEND: Install Python 3.9+ and confirm by running "python --version".  
[x] BACKEND: (Optional) Install Docker & Docker Compose for containerization.  
[x] BACKEND: Install Yarn or confirm npm is available (global package managers).  
[x] BACKEND: Verify Git is installed for version control (git --version).  
[x] BACKEND: Create a new repository folder (e.g., finance-crm) or clone an existing one.  
[x] BACKEND: Ensure .gitignore includes Node, Python venv, IDE, and OS-specific files.  
[x] BACKEND: Create top-level folders (/app, /services/core-crm, /services/ai-service) following best practices.  
[x] BACKEND: Place a README.md at the root with an overview of codebase structure.  
[x] FRONTEND: In /app, run "npm init"  and install Remix (e.g., npx create-remix@latest).  
[x] BACKEND: In /services/core-crm, run "npm init" or "yarn init"; install TypeScript, Express, ESLint, etc.  
[x] BACKEND: In /services/ai-service, create a virtual environment (python -m venv venv) and install fastapi, uvicorn, flake8, black.  
[x] BACKEND: Set up ESLint & Prettier in /app and /services/core-crm for JavaScript/TypeScript.  
[x] BACKEND: Set up flake8 and black in /services/ai-service for Python linting.  
[x] BACKEND: Create .env files to store environment configurations (ORY_BASE_URL, DATABASE_URL, AI_SERVICE_URL).  
[x] BACKEND: Do not commit secrets; provide a .env.example for reference.  
[x] FRONTEND: Add "dev" script in /app/package.json (e.g., "remix dev") and test the Remix server.  
[x] BACKEND: Add a dev script in /services/core-crm (e.g., "tsc --watch & nodemon dist/index.js") and test the Node server.  
[x] BACKEND: In /services/ai-service, run uvicorn main:app --reload to confirm a placeholder route.  
[x] BACKEND: Verify all components run without errors and environment is correctly set up. 