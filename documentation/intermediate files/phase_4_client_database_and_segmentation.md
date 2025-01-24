# Phase 4: Basic Client Database & Segmentation

We now enable storing key client data in the CRM and provide the Manager (and Agents) the ability to segment by region, net worth, or risk category.

References:  
• @mvp_features.md (Basic Unified Client Database)  
• @User_stories.md (User Story 2.1, 2.2)  
• @high_level_overview.md (Client DB segmentation approach)  

---

## Features Covered in Phase 4
1. Client table storing fields like name, region, netWorth, riskTolerance.  
2. Searching and filtering for these fields (segmentation).  
3. Basic display of client data in the Agent UI (and optional manager views).  

---

## Checklist

1. FRONTEND TASKS (React Remix)  
   1.1 Create /clients route & listing page:  
       - Displays all clients in a table or list.  
       - Columns: name, region, netWorth, riskTolerance.  
       - Add a search/filter UI for region, net worth buckets, or risk category.  
   1.2 Create /clients/:clientId detail page:  
       - Show client's profile info (from the newly stored fields).  
       - Provide an "Edit Client" form if user has permission (Agent or Manager).  
   1.3 Segmentation actions:  
       - On the listing page, allow multiple filter combos (region, risk category, net worth bracket).  
       - Display the resulting subset.  
   1.4 UI styling:  
       - Possibly highlight "high net worth" in gold or a premium color (see @theme-rules.md).  

2. BACKEND TASKS (Core CRM)  
   2.1 Create "clients" table:  
       - Fields: id, name, region, net_worth, risk_tolerance, created_at, updated_at.  
   2.2 CRUD endpoints for clients:  
       - POST /clients (create).  
       - GET /clients – multi-criteria search.  
       - GET /clients/:id – retrieve one client.  
       - PATCH /clients/:id – update.  
   2.3 Filtering logic:  
       - Accept query params for region, netWorthMin, netWorthMax, riskTolerance.  
       - Return matching clients.  
   2.4 DB indexing & data validation:  
       - Index region and risk_tolerance if needed.  
       - Validate net_worth is numeric.  

3. TESTING & VERIFICATION  
   3.1 UI tests:
       - Searching for region="APAC" should return only matching clients.  
       - Searching for netWorth>1,000,000 yields HNW clients.  
   3.2 Access control checks:  
       - Agents can read or update clients.  
       - Clients themselves do not see the entire database. (Distinguish the "users" and "clients" tables if needed. Some clients have a user login, some do not.)  
   3.3 Integration with tickets:  
       - Confirm that tickets referencing client_id show the correct client info. 