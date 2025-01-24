

## 1. File Size & Organization

• Keep each file ≤ 250 lines for AI tooling compatibility.  
• Begin every file with a short header comment explaining its purpose/contents.  
• Separate core logic (routes, services) from supporting utilities (helpers, configs).  
• Adhere to a single responsibility per module/component; split large functionality into smaller files.  

---
## 2. Role & Security Model and System Design (Ref: @high_level_overview.md)

• Integrate ORY for authentication; store ory_identity_id in the users table.  
• Manager assigns local roles (Agent, Client, Manager, etc.) within the Core CRM.  
• Restrict Manager-only features (SLA config, role assignment, advanced dashboards); Clients see only their own tickets.  
• Validate tokens on every request; gracefully handle expired/invalid sessions.  

---
## 3. Theming & UI (Ref: @theme-rules.md, @ui-rules.md)

• Emphasize a "Continental/Business-Class + Sleek Fintech" feel (dark neutrals, occasional gold or bright teal accents).  
• Maintain consistent typography (e.g., modern sans-serif for body, refined serif or bold sans for headings).  
• Keep UIs responsive and accessible: ensure proper color contrast, provide keyboard focus states, and use ARIA labels.  
• Use subtle animations; avoid screen clutter or heavy motion that distracts from the corporate vibe.  

---

## 4. Tech Stack & Core Best Practices (Ref: @tech-stack-rules.md)

• Frontend: Use Remix loaders/actions for data flow; rely on secure cookies for session data.  
• Core CRM: Node.js/Express with TypeScript. Organize routes by domain (tickets, clients, SLA, etc.).  
• AI Service: Python/FastAPI. Keep endpoint logic small and separate from business logic (services/utilities).  
• Enforce linting and formatting (ESLint/Prettier for JS/TS, Flake8/Black for Python); fix errors promptly.  
• Use environment variables (.env) for secrets and config; do not commit sensitive data.  

---

## 5. Data Model & APIs (Ref: @data_model.md, @api_endpoints.md)

• Keep to the established schema: users (including ORY identity), clients, tickets, ticket_messages, SLA, bulk_email_campaigns.  
• For additional features (FAQ, RAG), use separate tables or external data stores as needed.  
• Prefix Express routes with /api (e.g., /api/tickets); restrict endpoints based on local roles (Agent, Manager, Client).  
• Keep consistent naming: use descriptive resource names (e.g., /clients, /bulk-email).  
• Return ISO 8601 timestamps; handle status codes properly (2xx, 4xx, 5xx).  

---



## 6. Additional Guidelines

• Use transactions for multi-step database operations; ensure data integrity on create/update.  
• Test multi-channel ticket creation thoroughly (chat, email, WhatsApp) if implemented.  
• Keep the design consistent with the brand: color-coded status (blue/teal for new, gold/red for urgent).  
• Document functions/classes with TSDoc (TypeScript) or docstrings (Python) to clarify usage and parameters.  

---


