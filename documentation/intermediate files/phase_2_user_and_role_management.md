# Phase 2: ORY Integration & Local Role Management

This phase implements user identity flows with ORY SDK on the frontend and sets up local user/role tables in the Core CRM. It follows from Phase 1's project structure and ensures that each new user is recognized locally.

References:  
• @high_level_overview.md (Userflows & Data Handling)  
• @tech-stack-rules.md (Authentication with ORY tokens, RBAC layer)  
• @mvp_features.md (Basic login for Agents, Manager role creation)  
• @User_stories.md (User stories 1.1, 2.1 for referencing roles, though these primarily apply to the next phases)  

---

## Features Covered in Phase 2
1. Frontend integration with ORY SDK for login.  
2. Local database schema for "users" table referencing ory_identity_id.  
3. Manager capability to assign roles (Agent, Manager, Client).  

---

## Checklist

1. FRONTEND TASKS (React Remix)  
   1.1 Install ORY SDK:  
       - Configure environment variables for ORY endpoints.  
       - Add any required callbacks or environment config.  
   1.2 Create a /login route:  
       - Utilize ORY's React components or your own form that calls ORY APIs.  
       - On success, store tokens (securely) and redirect to a protected route (e.g., /dashboard).  
   1.3 Implement user session checks:  
       - Global state or Route loader that checks if the user is logged in (token present).  
       - If not logged in, redirect to /login.  

2. BACKEND TASKS (Core CRM)  
   2.1 Add a "users" table:  
       - Fields: id, ory_identity_id, email, name, created_at, updated_at.  
   2.2 Add a "roles" mechanism:  
       - Either a separate user_roles table (user_id, role) or a roles column in "users" (for MVP).  
   2.3 Implement an auth middleware:  
       - Decodes the ORY token and verifies it.  
       - On validated token, checks DB for user with matching ory_identity_id.  
       - If user not found, create one.  
   2.4 Add an API to set roles:  
       - Endpoint: POST /users/:id/role { role: "Agent" | "Manager" | "Client" }.  
       - Restricted to Manager role only.  
   2.5 Test role-based endpoints:  
       - Example: only Manager can assign roles.  

3. TESTING & VERIFICATION  
   3.1 Manual test the login flow:  
       - Hit /login, sign in with ORY. Confirm user is created in local DB.  
   3.2 Confirm role-based checks:  
       - Attempt to set a role as a non-Manager user; expect forbidden error.  
       - As Manager, successfully update roles.  

4. DEPLOYMENT CHECK (Optional)  
   4.1 If containerized, confirm environment variables for ORY are properly passed.  
   4.2 Ensure no broken references or missing tokens in dev vs. production usage. 