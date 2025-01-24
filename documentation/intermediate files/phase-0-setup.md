# Phase 0: Initial Project Setup & Environment Configuration

This phase ensures all core dependencies, development tools, and environment variables are correctly installed and configured before moving to the structured MVP phases. By completing these steps, you'll have a solid foundation for building and running the Finance CRM across the React Remix frontend, the Core CRM (Express, Node.js), and the AI Service (FastAPI, Python).

---

## Checklist

1. System Requirements
   1.1 Install Node.js (v16+ recommended)  
       - Confirm by running: node -v  
   1.2 Install Python 3.9+  
       - Confirm by running: python --version or python3 --version  
   1.3 (Optional) Install Docker & Docker Compose  
       - If you plan to containerize from the start or set up a local dev environment with multiple services simultaneously.  

2. Global Dependencies & Package Managers
   2.1 Install Yarn (or continue with npm)  
       - yarn --version to confirm.  
   2.2 Verify Git is installed for version control  
       - git --version  

3. Repository Initialization
   3.1 Create a new repository folder (e.g., finance-crm)  
       - git init (if starting from scratch) or clone an existing repo if provided.  
   3.2 Ensure .gitignore file includes typical Node-related ignores, Python venv, and IDE files.  

4. Project Monorepo Structure
   4.1 Create the following top-level folders (following @codebase-best-practices.md):
       - /app (for the React Remix frontend)  
       - /services/core-crm (Express + TypeScript backend)  
       - /services/ai-service (FastAPI + Python backend)  
   4.2 Place README.md at the root with an overview of the codebase structure.  

5. Node.js & Python Environment Setup
   5.1 For the React Remix frontend (/app):  
       - cd app && npm init -y (or yarn init -y)  
       - Install Remix dependencies (e.g., npx create-remix@latest).  
       - Confirm package.json is generated.  
   5.2 For the Core CRM (/services/core-crm):  
       - cd services/core-crm && npm init -y (or yarn init -y)  
       - Install TypeScript, Express, ESLint, etc. (detailed in Phase 1).  
   5.3 For the AI Service (/services/ai-service):  
       - cd services/ai-service  
       - python -m venv venv (create a virtual environment)  
       - source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows)  
       - pip install fastapi uvicorn and any desired linting tools (flake8, black).  

6. Development Tooling and Linting
   6.1 ESLint / Prettier for JavaScript/TypeScript code  
       - Set up ESLint in /app and /services/core-crm.  
       - Configure .eslintrc and .prettierrc for consistent formatting.  
   6.2 Python linters  
       - For /services/ai-service, use flake8 or black.  
   6.3 Optional Editor Configuration  
       - Configure VSCode or your preferred IDE with recommended extensions (e.g., ESLint, Prettier, Python, Docker).  

7. Environment Files & Secrets
   7.1 Create .env files  
       - At minimum, define environment variables for database credentials, ORY endpoints, and any external API tokens.  
       - Example keys:  
         - ORY_BASE_URL=...  
         - DATABASE_URL=... (for Core CRM)  
         - AI_SERVICE_URL=... (if referencing internal or external AI)  
   7.2 Store secrets securely  
       - Never commit secrets to source control.  
       - Use a .env.example template to indicate required variables.  

8. Verification & Basic Scripts
   8.1 Write basic "start" or "dev" scripts in package.json  
       - E.g., "scripts": { "dev": "remix dev" } in /app.  
       - "scripts": { "dev": "tsc --watch & nodemon dist/index.js" } in /services/core-crm.  
       - For AI service: run uvicorn main:app --reload.  
   8.2 Test each environment quickly  
       - For the frontend, run npm run dev (or yarn dev) to ensure Remix spins up.  
       - For the core-crm, run npm run dev to confirm the server starts (even if just returning "Hello World").  
       - For the AI service, uvicorn main:app --reload to confirm a placeholder route.  

9. Next Steps
   - With all tools, dependencies, and environment variables in place, you're ready to proceed to Phase 1 ("Project Setup & Basic Infrastructure").  
   - Keep these environment details documented so future team members can onboard easily.  

---

## Conclusion

By completing Phase 0, you've established the baseline environment, dependencies, and tooling for the Finance CRM MVP. This essential foundation ensures a smooth transition into subsequent phases where you'll implement specific features (tickets, AI suggestions, multi-channel ingestion, client portals) according to @mvp_features.md, @User_stories.md, and the rest of the project documentation. 