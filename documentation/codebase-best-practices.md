# Codebase Best Practices

This document outlines how to structure and maintain a scalable, AI-first codebase for the Finance CRM MVP. It references the principles and rules defined in @high_level_overview.md, @tech-stack-rules.md, @ui-rules.md, and @theme-rules.md to ensure that:

1. The codebase follows clear organization and separation of concerns.  
2. Each file is kept under 250 lines to remain AI-friendly for tools like Cursor's.  
3. Every file contains an explanatory header comment.  
4. Each function or class has proper documentation (e.g., JSDoc/TSDoc) describing parameters and return types.  

---

## 1. Folder Structure & File Organization

Below is a suggested file tree that reflects the two-service approach (Express-based Core CRM and Python-based AI Service) and a Remix frontend. This structure balances clarity, modularity, and alignment with the MVP requirements (ticketing, AI integration, multi-channel features, etc.). Adjust the structure as needed for your specific deployment or scaling needs. 

finance-crm/
├─ README.md
├─ .gitignore
├─ package.json
├─ yarn.lock (or package-lock.json)
│
├─ app/ # React Remix Frontend
│ ├─ routes/
│ │ ├─ login.tsx # Login page using ORY SDK
│ │ ├─ dashboard.tsx # Displays unread tickets, AI suggestions
│ │ ├─ manager/ # Manager-specific routes
│ │ └─ portal/ # Client portal routes
│ ├─ components/
│ │ ├─ TicketCard.tsx
│ │ ├─ ClientProfile.tsx
│ │ └─ ...
│ ├─ styles/
│ │ └─ ...
│ ├─ hooks/
│ │ └─ useAuth.ts # Example custom hook for ORY auth
│ ├─ utils/
│ │ └─ httpClient.ts # Configures requests to Core CRM & AI services
│ └─ ...
│
├─ services/
│ ├─ core-crm/ # Express (TypeScript) - Main CRM backend
│ │ ├─ src/
│ │ │ ├─ index.ts # Entry point for Express server
│ │ │ ├─ routes/
│ │ │ │ ├─ tickets.ts # Routes for ticket CRUD
│ │ │ │ ├─ clients.ts # Routes for client CRUD, segmentation
│ │ │ │ └─ ...
│ │ │ ├─ controllers/
│ │ │ │ └─ TicketController.ts
│ │ │ ├─ services/
│ │ │ │ └─ AIPipeline.ts # Calls AI service for suggestions
│ │ │ ├─ middlewares/
│ │ │ │ └─ authMiddleware.ts
│ │ │ ├─ models/
│ │ │ │ └─ Ticket.ts
│ │ │ ├─ config/
│ │ │ │ └─ database.ts
│ │ │ └─ ...
│ │ ├─ package.json
│ │ └─ tsconfig.json
│ │
│ └─ ai-service/ # Python FastAPI
│ ├─ main.py # FastAPI entry point
│ ├─ requirements.txt
│ ├─ routers/
│ │ ├─ ai_suggested_reply.py
│ │ ├─ auto_generate_faq.py
│ │ └─ ...
│ ├─ services/
│ │ └─ rag_ingestion.py
│ └─ ...
│
├─ docs/ # Documentation
│ ├─ ui-rules.md
│ ├─ theme-rules.md
│ ├─ tech-stack-rules.md
│ └─ high_level_overview.md
│
└─ codebase-best-practices.md # This file


---

## 2. Recommended Conventions & Standards

1. Each file should begin with a header comment that explains the file’s contents, purpose, and any key dependencies.  
2. For TypeScript code in the Core CRM and Remix app, use TSDoc (@param, @returns) for functions, classes, and interfaces:  
   - Document parameters for clarity.  
   - Briefly describe the return value or side effects.  
3. For Python in AI Service (FastAPI), use docstrings (triple quotes) to explain endpoints and their query parameters, request bodies, or returned values.  
4. Keep each file under 250 lines to maintain readability and facilitate AI-assisted operations. If a file grows beyond this threshold, refactor or split into smaller modules.

---

## 3. Code Organization & Modularity

• Follow the Single Responsibility Principle: each module, component, or function has one well-defined functionality.  
• In the Remix app, separate top-level route files (e.g., /dashboard.tsx) from deeper route subfolders (e.g., /manager, /portal).  
• In the Express Core CRM, group routes by domain (tickets, clients, bulk email, SLA config) and implement a corresponding controller or service file for each.  
• In the AI service, maintain distinct routers for each major feature (suggested replies, FAQ generation, ingestion) and keep business logic in separate service or utility files.

---

## 4. Ensuring Alignment with UI & Theme Rules

• Reference @ui-rules.md and @theme-rules.md when building both the frontend (components, styles) and any server-rendered UI pages.  
• Keep accessibility and responsiveness in mind: use Remix’s loader/action for data fetching while applying modular CSS or a utility-first framework (if desired) for fluid layouts.  
• When implementing theme accents (e.g., gold for high-priority tickets or teal for standard items), maintain consistency across all React components and any server-side email templates.  

---

## 5. Logging, Error Handling & Testing

• Use a consistent logging pattern (e.g., Winston or Pino in Node.js) for the Core CRM; in Python, you could use the native logging module or libraries like Loguru.  
• Implement uniform error-handling middlewares or utility functions so errors are captured and reported clearly.  
• For testing:
  - In the frontend, use frameworks like React Testing Library for component behavior.  
  - In the Core CRM, unit-test controllers/services with a mocking approach for the database/AI service.  
  - In the AI service, test each endpoint’s logic and potential edge cases (e.g., missing fields, large file ingestion).

---

## 6. Scaling & Future Extensions

• Keep the recommended line limit to ensure new features (like real-time notifications or advanced AI compliance) remain manageable in separate modules.  
• Use environment-specific configurations to handle differences in local dev, staging, and production for ORY integration, database settings, etc. (see “Config & Secrets” best practices in @tech-stack-rules.md).  
• Document any new services or microservices under /services to clarify their domain (notifications, analytics, etc.) and integrate them into the code tree as the project evolves.

---

## Conclusion

Adhering to these folder structures, naming conventions, and file size limits will help keep the Finance CRM codebase maintainable, accessible to AI-driven assistance, and aligned with the architectural and design rules set out in @high_level_overview.md, @tech-stack-rules.md, @ui-rules.md, and @theme-rules.md. This consistent, modular approach will foster reliable development and ease future expansions or integrations.