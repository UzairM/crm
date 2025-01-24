# Phase 4 (Flattened Checklist)

[ ] FRONTEND: Create /clients route with a listing of all clients (name, region, netWorth, riskTolerance).  
[ ] FRONTEND: Add search/filter UI for region, net worth brackets, and risk category.  
[ ] FRONTEND: Create /clients/:clientId detail page to show and edit client info (if permission allows).  
[ ] FRONTEND: Implement multiple filter combos on the listing page (region, risk category, net worth bracket).  
[ ] FRONTEND: Use stylistic highlights for high net worth in gold or premium color.  
[ ] BACKEND: Create "clients" table (id, name, region, net_worth, risk_tolerance, timestamps).  
[ ] BACKEND: CRUD endpoints for clients: POST /clients, GET /clients (multi-criteria), GET /clients/:id, PATCH /clients/:id.  
[ ] BACKEND: Implement filtering by region, netWorthMin, netWorthMax, riskTolerance.  
[ ] BACKEND: Validate net_worth is numeric; optionally index region/risk_tolerance.  
[ ] BACKEND: Ensure that Agents can read or update clients.  
[ ] BACKEND: Distinguish between "users" and "clients" if some clients are also users.  
[ ] FRONTEND: Test searching for region="APAC" or netWorth>1,000,000.  
[ ] BACKEND: Integrate tickets with client_id to show correct client info.  
[ ] FRONTEND: Confirm the listing page and detail page function as intended. 