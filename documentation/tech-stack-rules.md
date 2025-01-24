# Tech Stack Rules & Best Practices

This document covers best practices, common pitfalls, and important considerations for each technology used in the Finance CRM MVP (as described in high_level_overview.md). The solution comprises:

1. A React Remix frontend (TypeScript).  
2. A Core CRM Service (TypeScript, Node.js with Express).  
3. An AI Service (Python, FastAPI).  
4. ORY for authentication (hosted service, with the ORY SDK on the frontend).  
5. A relational database (e.g., PostgreSQL) and an optional vector store for AI retrieval.  

Below are guidelines, conventions, and limitations for each primary component.

---

## 1. Frontend: React Remix with TypeScript

### 1.1 Best Practices

1. Keep Routes Organized:  
   - Separate routes and subroutes (e.g., /dashboard, /manager, /portal) into logical folders.  
   - Use nested routes for more complex flows, but avoid over-nesting that could complicate maintainability.

2. Strong Typing with TypeScript:  
   - Define clear interface types (e.g., Ticket, User, Client).  
   - Avoid using "any" for critical data paths to benefit from compile-time checks and clarity.

3. Leverage Remix Features:  
   - Utilize Remix's loader/action structure for handling form submissions and data loading.  
   - Handle data mutations and error scenarios in a consistent, predictable manner.

4. Integrate ORY SDK for Login:  
   - Provide a seamless in-app login experience using ORY's React components or custom code calling ORY's APIs.  
   - Maintain sessions/tokens securely (httpOnly cookies or a recommended alternative).

5. Security & State Management:  
   - Use secure cookies to store session tokens, rather than localStorage, to reduce XSS risk.  
   - If you need persistent sessions, implement refresh tokens or ORY-based session extensions.

### 1.2 Limitations & Common Pitfalls

1. SEO & Routing:  
   - Remix supports server-side rendering; ensure any dynamic routes or protected routes are handled properly.  
   - Large nested routes can impact performance and complexity.

2. Session Invalidation:  
   - If using cookies or short-lived tokens, handle session expiration gracefully (frontend and backend).  
   - Upon logout, ensure tokens are invalidated or sessions ended at ORY.

3. Large Data Rendering:  
   - Consider pagination or lazy-loading for large volumes of data (tickets, client lists).  
   - Over-fetching can degrade client-side performance.

---

## 2. Core CRM Service (TypeScript, Node.js with Express)

### 2.1 Best Practices

1. Express Project Structure:  
   - Organize controllers, routes, and middleware in modular folders (e.g., /routes, /controllers).  
   - Separate business logic (services) from route handlers to keep code maintainable.

2. Data Access:  
   - Use a robust ORM or query builder (e.g., TypeORM, Prisma, or Sequelize).  
   - Manage schema migrations properly (version control them).

3. Authentication with ORY Tokens:  
   - Implement a custom Express middleware that verifies incoming ORY tokens before processing requests.  
   - If a new user logs in via ORY, create a local user record referencing the ORY Identity ID.

4. Role-Based Access Control (RBAC) Layer:  
   - Store roles in a user_roles table or within the user table if roles are simple.  
   - Restrict endpoints via Express middleware that checks user roles.

5. Logging & Monitoring:  
   - Use libraries like Winston or Pino for structured logging.  
   - Consider a monitoring stack (Prometheus/Grafana or a SaaS alternative) for performance analytics.

### 2.2 Limitations & Common Pitfalls

1. Scalability Concerns:  
   - A single Express instance might be a bottleneck if traffic is high.  
   - For scaling, run multiple instances behind a load balancer (and ensure session management is stateless).

2. Large File Uploads:  
   - For PST or large attachments, use streaming approaches or configure Multer carefully to avoid memory overflows.  
   - Validate file size limits to protect against DoS attacks.

3. Transactions & Concurrency:  
   - For multi-step writes (e.g., creating a ticket, adding messages), ensure either atomic transactions or thorough rollback logic.  
   - ORM-based tools can help, but test carefully in high-concurrency scenarios.

4. SQL Migration Pitfalls:  
   - Always apply migrations in a controlled manner, especially for production.  
   - Breaking schema changes can create downtime or data inconsistencies.

---

## 3. AI Service (Python, FastAPI)

### 3.1 Best Practices

1. Layered Architecture:  
   - Separate your API endpoints (FastAPI route definitions) from the business logic (services or modules).  
   - Keep ingestion logic (PST/email) separate from real-time endpoints (suggested replies).

2. API Contracts:  
   - Define pydantic models for request/response validation.  
   - Maintain consistent data structures that align with the Core CRM's request format (e.g., Ticket objects).

3. LLM & Knowledge Base Integration:  
   - Use libraries like Hugging Face Transformers or spaCy for NLP.  
   - Implement caching or short-term storage for frequently requested suggestions to reduce API calls to external LLM providers.

4. RAG (Retrieval-Augmented Generation):  
   - Use vector stores (Faiss, Pinecone, or Elasticsearch) if you need advanced document retrieval.  
   - Keep indexing and retrieval logic modular to swap out backends if needed.

5. Data Security:  
   - If referencing sensitive financial data in embeddings, consider encrypting or pseudo-anonymizing.  
   - Follow data retention policies and local privacy laws.

### 3.2 Limitations & Common Pitfalls

1. External LLM Dependency:  
   - Heavy reliance on external APIs can introduce latency and cost.  
   - Maintain fallback mechanisms if the external LLM is unreachable or rate-limited.

2. Complex Email/PST Ingestion:  
   - PST files differ in structure and can contain nested or corrupted data.  
   - Thoroughly test ingestion to avoid partial or incorrect indexing.

3. Large Vector Indexes:  
   - As data grows, vector lookups can slow down if not scaled properly.  
   - Plan for chunking and incremental updates to maintain performance.

4. Quality of AI Suggestions:  
   - Without fine-tuning or domain adaptation, suggestions might not align with strict finance compliance rules.  
   - A "human in the loop" approach is recommended for sensitive replies.

---

## 4. Database & Data Flow

### 4.1 Relational Database (e.g., PostgreSQL)

1. Schema Normalization:  
   - Proper foreign keys among users, tickets, and roles ensures data integrity.  
   - Use timestamps (createdAt, updatedAt) for auditing.

2. Role/Data Model:  
   - A "user" table with an ory_identity_id column maps to ORY.  
   - A user_roles join table (user_id, local_role) can handle multiple roles if needed.

3. Data Growth Management:  
   - If the ticket data grows significantly, consider archive strategies.  
   - Regular indexing on commonly queried fields (e.g., ticket status, assigned agent) for performance.

### 4.2 Vector Store (Optional)

1. Chunk Sizing & Embeddings:  
   - Split large documents into logical chunks before embedding.  
   - Pursue domain-relevant embeddings if certain finance jargon is crucial.

2. Index Refresh Strategy:  
   - Implement partial or incremental indexing to avoid complete re-index overhead.  
   - Keep track of last-ingested timestamps to avoid re-embedding duplicates.

---

## 5. ORY Integration & Authentication Workflow

### 5.1 Best Practices

1. Frontend (ORY SDK)  
   - Embed or customize ORY's login/registration flows within React Remix.  
   - Store session data securely (e.g., in cookies) and guard routes that require authentication.

2. JWT/Session Validation in Express  
   - Create a middleware to validate the token from ORY for each protected route.  
   - Upon token validation success, fetch or update local user info (e.g., checking if the user is in the CRM database).

3. Role Assignment Flow  
   - Manager uses a dedicated endpoint (e.g., POST /users/:id/role) to set roles.  
   - The CRM enforces RBAC based on those roles.

4. Logout & Token Invalidation  
   - Ensure the frontend explicitly logs out from ORY and invalidates local sessions.  
   - Handle expired sessions gracefully; prompt re-login if a token is no longer valid.

### 5.2 Limitations & Pitfalls

1. Session & Token Lifetimes  
   - If tokens are short-lived, frequent re-auth requests could be a performance overhead.  
   - Carefully configure ORY session settings in line with your usage patterns.

2. Environment Mismatch  
   - Ensure the correct ORY environment (test vs. production) is used in each environment.  
   - Avoid mixing credentials or endpoints inadvertently.

3. Handling Access for New Users  
   - A newly created user in ORY might not yet exist in the CRM.  
   - A "pending role" or "no role" default is recommended until a Manager assigns one.

---

## 6. Deployment & Operations

1. Containerization  
   - Dockerize each service (Core with Express, AI with FastAPI).  
   - Minimal base images improve security and performance.

2. CI/CD  
   - Run ESLint and TypeScript checks for the frontend and Core.  
   - Use Python linting/formatting (flake8, black) and tests for the AI service.  
   - Automate test pipelines to verify integration before merging.

3. Monitoring & Logging  
   - Collect server logs (Express, Node's console) and AI logs (FastAPI) in a centralized system.  
   - Use or integrate with APM tools to monitor latencies (especially in AI calls).

4. SSL/TLS  
   - Ensure secure communication (HTTPS) between frontend and server.  
   - If self-hosted, renew certificates (e.g., Let's Encrypt) before expiration.

5. Horizontal Scaling  
   - For Express, implement a load balancer and run multiple instances of the Core.  
   - For the AI service, scale horizontally if CPU or memory usage is high (e.g., vector search, large LLM usage).

---

## 7. Common Pitfalls & Final Checklist

- Forgetting to validate tokens on every request to the Express server, leaving endpoints open.  
- Improperly storing large PST/email attachments in memory (use streaming or chunking).  
- Overusing "any" in TypeScript, missing out on static analysis.  
- Failing to test multi-channel ticket creation thoroughly (e.g., chat, email, WhatsApp).  
- Not using transactions for multi-step data operations, risking partial writes.  
- Omitting ory_identity_id updates if the user changes info in ORY (e.g., their email).

---

## Conclusion

By following these guidelines, the Finance CRM MVP—comprising a React Remix TypeScript frontend, an Express-based Node.js Core service, and a Python FastAPI AI service—can be developed in a flexible, secure, and scalable manner. ORY integration offloads user authentication, while local role management ensures fine-grained access control. Proper data modeling, logging, and testing will help maintain system stability and extensibility as the product evolves. 