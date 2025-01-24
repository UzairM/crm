# Phase 3 (Flattened Checklist)

[ ] FRONTEND: Create a "TicketList" component (route /tickets or /dashboard) showing tickets assigned to the logged-in agent.  
[ ] FRONTEND: Integrate query parameters (status=new, unread) to filter tickets.  
[ ] FRONTEND: Create a "TicketDetail" component (route /tickets/:ticketId) to fetch messages, internal notes, and client info.  
[ ] FRONTEND: Provide a text area or modal to add internal notes to a ticket.  
[ ] FRONTEND: On visiting /tickets/:ticketId, call an endpoint to mark ticket as read.  
[ ] FRONTEND: Apply @theme-rules.md for "Ticket Card" styling and color-coded statuses (open=teal, new=blue).  
[ ] BACKEND: In /services/core-crm, create a "tickets" table (id, subject, status, assigned_agent_id, client_id, timestamps).  
[ ] BACKEND: Use an enum/string for status: ["New", "Open", "Closed", etc.].  
[ ] BACKEND: Create a "ticket_messages" table (id, ticket_id, sender, text, is_internal_note, created_at).  
[ ] BACKEND: Implement ticket endpoints (POST /tickets, GET /tickets, GET /tickets/:id, PATCH /tickets/:id, POST /tickets/:id/messages).  
[ ] BACKEND: Restrict agents to see only assigned or unassigned tickets; managers see all.  
[ ] BACKEND: For marking as read, consider a pivot table or simplified logic in MVP.  
[ ] BACKEND: Manually test endpoints with Postman for CRUD. Confirm assigned agent sees assigned tickets.  
[ ] BACKEND: Ensure internal notes are properly flagged.  
[ ] FRONTEND: E2E test: login as Agent, view /tickets, open one, and add internal notes.  
[ ] FRONTEND: Confirm read/unread transitions happen. 