# Phase 2 (Flattened Checklist)

[x] FRONTEND: Install ORY SDK and configure environment variables for ORY endpoints.  
[x] FRONTEND: Add /login route that uses ORY APIs (custom form or ORY's React components).  
[x] FRONTEND: On successful login, store tokens securely and redirect to /dashboard.  
[x] FRONTEND: Implement user session checks (token presence) in a loader or global state.  
[x] FRONTEND: If no token, redirect to /login.  
[x] BACKEND: In /services/core-crm, create "users" table (fields: id, ory_identity_id, email, name, timestamps).  
[x] BACKEND: Add roles mechanism (either a separate user_roles table or a roles column in users table).  
[x] BACKEND: Implement auth middleware to decode ORY token and verify.  
[x] BACKEND: If user is not found in DB, create one with matching ory_identity_id.  
[x] BACKEND: Add POST /users/:id/role to assign role ("Agent", "Manager", "Client"), restricted to Manager.  
[x] BACKEND: Confirm that non-Managers cannot set roles (permission checks).  
[x] BACKEND: Verify role-based endpoints (forbidden if not Manager).  
[ ] BACKEND: Test login flow (sign in with ORY, user created in local DB).  
[ ] BACKEND: Verify environment variables pass to containers if Dockerized.