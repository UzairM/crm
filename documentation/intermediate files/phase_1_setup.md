# Phase 1: Project Setup & Basic Infrastructure

This phase establishes the fundamental codebase structure and integrates the essential pieces:  
• React Remix frontend (TypeScript)  
• Core CRM Service (TypeScript, Node.js with Express)  
• AI Service (Python, FastAPI)  
• ORY SDK setup (for future authentication and roles)  

References:  
• @high_level_overview.md – Architecture overview  
• @tech-stack-rules.md – Tech stack best practices  
• @codebase-best-practices.md – File layout, line limits, TSDoc  
• @ui-rules.md and @theme-rules.md – Not heavily used here, but keep them in mind for folder structure and theming approach  

---

## Features Covered in Phase 1
1. Initialize repository and folder structure (following "codebase-best-practices.md").  
2. Set up React Remix app with placeholder routes.  
3. Set up Node.js Express server for the Core CRM with a basic "Hello World" endpoint.  
4. Set up FastAPI for the AI service with a basic "Ping" endpoint.  

---

## Checklist

1. FRONTEND TASKS (React Remix)  
   1.1 Create a new Remix project:  
       - Initialize React Remix with TypeScript (e.g., npx create-remix@latest).  
       - Set up a folder structure aligned with @codebase-best-practices.md (app/routes, app/components, etc.).  
   1.2 Implement a placeholder route:  
       - "/" route that renders a simple "Welcome to Finance CRM MVP" message.  
       - Confirm the app compiles and runs locally.  
   1.3 Add environment configurations:  
       - Create .env or similar for environment variables (e.g., ORY settings, API URLs to Core CRM and AI services).  
       - Use recommended environment handling from @tech-stack-rules.md.  

2. BACKEND TASKS (Core CRM, Node.js + Express)  
   2.1 Initialize Node.js and TypeScript:  
       - npm init (or yarn init) in /services/core-crm.  
       - Configure tsconfig.json to comply with codebase line limit rules.  
   2.2 Add a basic Express server:  
       - Single route GET /ping returning { status: "ok" }.  
       - Set up modular folder structure (routes, models, etc.) as per @codebase-best-practices.md.  
   2.3 Database connectivity (placeholder):  
       - Configure a simple database.ts or similar to connect to a local dev DB (PostgreSQL recommended).  
       - For this phase, you can just confirm a connection or skip actual DB logic until next phase.  

3. BACKEND TASKS (AI Service, Python + FastAPI)  
   3.1 Initialize Python environment:  
       - Create a virtual environment, install FastAPI and Uvicorn.  
       - Add a requirements.txt for future dependency tracking.  
   3.2 Add a basic FastAPI app:  
       - Main route GET /ping returning { "message": "AI Service up!" }.  
       - Confirm it runs with uvicorn main:app.  

4. TESTING & VERIFICATION  
   4.1 Smoke test each service:  
       - Confirm React Remix serves the placeholder page on its dev port.  
       - Access Core CRM "/ping" endpoint, verify response.  
       - Access AI Service "/ping" endpoint, verify response.  
   4.2 Code quality checks:  
       - Run ESLint/Prettier (Node side) and flake8/black (Python side) if preferred, per @tech-stack-rules.md.  

5. DEPLOYMENT (Optional for MVP)  
   5.1 Containerization draft:  
       - Dockerfiles for each service.  
       - This can be minimal, focusing on installing dependencies and running the dev servers.  
   5.2 Basic orchestration:  
       - docker-compose or minimal instructions to run all three services simultaneously. 