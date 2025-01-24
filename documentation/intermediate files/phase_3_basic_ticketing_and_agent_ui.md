# Phase 3: Basic Ticketing & Agent UI

In this phase, we focus on creating and managing tickets from the Agent perspective. The UI must display unread/new tickets, while the backend manages ticket creation, assignment, status, and internal notes.

References:  
• @mvp_features.md (Basic Support Agent UI, subset of AI-Powered Ticketing)  
• @User_stories.md (User Story 1.1, 1.2)  
• @ui-rules.md (Component structures for ticket lists, detail views)  
• @theme-rules.md (Styling these new components consistently)  

---

## Features Covered in Phase 3
1. Ticket creation (manual for now).  
2. Agent UI: unread/new tickets, detail views, internal notes.  
3. Basic status transitions for tickets (e.g., "Open," "In Progress," "Closed").  

---

## Checklist

1. FRONTEND TASKS (React Remix)  
   1.1 Create a "TicketList" component:  
       - A route: /dashboard or /tickets showing a list of tickets assigned to the logged-in agent.  
       - Integrate query parameters for "status=new" or "unread".  
   1.2 Implement a "TicketDetail" component:  
       - A route: /tickets/:ticketId that fetches all messages, including internal notes, and the client's short profile.  
       - Provide a text area or modal to add internal notes.  
   1.3 Marking tickets as read:  
       - On opening /tickets/:ticketId, call an endpoint to mark them as read.  
   1.4 UI theming:  
       - Apply the "Ticket Card" style in line with @theme-rules.md.  
       - Ensure color-coded statuses for quick scanning (e.g., open=teal, new=blue highlight).  

2. BACKEND TASKS (Core CRM)  
   2.1 Create "tickets" table:  
       - Fields: id, subject, status, assigned_agent_id, client_id, created_at, updated_at.  
       - Status can be an enum or string: ["New", "Open", "Closed", ...].  
   2.2 Create "ticket_messages" table:  
       - Fields: id, ticket_id, sender (agent or client), text, is_internal_note (boolean), created_at.  
   2.3 Implement ticket endpoints:  
       - POST /tickets (create a new ticket).  
       - GET /tickets?status=... (list tickets, optionally by agent or status).  
       - GET /tickets/:id (details, including messages).  
       - PATCH /tickets/:id (update status, assigned agent, or mark read).  
       - POST /tickets/:id/messages (add messages/notes).  
   2.4 Access control:  
       - Agents can see only their assigned tickets or any unassigned tickets.  
       - Managers can see all. (Modifications to come in future phase if needed.)  
   2.5 Marking as read logic:  
       - Possibly track read/unread per agent in a pivot table or a "read_by_agent_id" approach (for MVP, you could have a simpler approach).  

3. TESTING & VERIFICATION  
   3.1 Frontend E2E checks:  
       - Login as an Agent to see /tickets. Confirm new/unread tickets are on top.  
       - Click to open a ticket, internal notes are visible.  
       - Mark a note as "internal" or "public" (if needed).  
   3.2 API correctness:  
       - Manually call endpoints with Postman or similar to confirm CRUD.  
       - Confirm that the assigned agent can see the ticket in the list.  

4. UI/UX Refinements  
   4.1 Follow @ui-rules.md for consistent component organization.  
   4.2 Follow @theme-rules.md for color usage (Sleek Tech style with business-class vibes). 