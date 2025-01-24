# Phase 8: Basic Client Ticket Portal

The final phase of the MVP allows clients to log in, view their own tickets, and add comments. This closes the loop on the self-service portal.

References:  
• @mvp_features.md (Basic Client Ticket Portal)  
• @User_stories.md (10.1, 10.2)  
• @high_level_overview.md (Client role assignment in local DB)  
• @ui-rules.md (Accessibility & responsiveness for client-facing pages)  

---

## Features Covered in Phase 8
1. Client role within the system.  
2. Client can see their own open/closed tickets.  
3. Client can add updates or comments to existing tickets.  

---

## Checklist

1. FRONTEND TASKS (React Remix) – Client Portal  
   1.1 Portal routing:  
       - /portal or /client route, accessible only if user.role == "Client".  
   1.2 Ticket listing:  
       - Show open vs. closed tickets for the logged-in client.  
       - Provide a link to a detail page for each.  
   1.3 Ticket detail with comment form:  
       - Display past messages (client + agent) but hide internal agent notes.  
       - A text box to add a new comment (sends to the CRM).  
   1.4 Visual cues & theming:  
       - Follow "Sleek Tech + Business-Class" vibe; ensure it's streamlined for non-technical end-users.  

2. BACKEND TASKS (Core CRM)  
   2.1 Ensure a "Client" role user is recognized:  
       - If user logs in with ORY and no local record, default them to role="Client" (or manager sets it).  
   2.2 Ticket endpoints for clients:  
       - GET /tickets?client_id=... – only return the user's own tickets.  
       - GET /tickets/:id – verify that the ticket belongs to the client.  
       - POST /tickets/:id/messages – accept new client messages.  
   2.3 Hide internal notes:  
       - Filter out any is_internal_note=true messages for the client's view.  

3. TESTING & VERIFICATION  
   3.1 Client login test:  
       - Log in as a "Client," see only relevant tickets.  
   3.2 Add comment flow:  
       - Add a comment or upload a small attachment if that's in scope.  
       - Confirm the assigned agent sees the new message.  
   3.3 Overall end-to-end check:  
       - The system now covers Agents, Managers, and Clients with all core flows from raising a ticket to resolution.  

4. FUTURE IMPROVEMENTS (Post-MVP)  
   4.1 Expand client profile editing or self-service knowledge base.  
   4.2 Real-time notifications for Agents on new client comments.  
   4.3 Additional compliance disclaimers or advanced AI features in the client portal. 