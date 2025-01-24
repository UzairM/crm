# Phase 8 (Flattened Checklist)

[ ] FRONTEND: Create a /portal or /client route accessible only if user.role == "Client".  
[ ] FRONTEND: Show open vs. closed tickets for the logged-in client.  
[ ] FRONTEND: Link to a ticket detail page that displays the conversation (excluding internal agent notes).  
[ ] FRONTEND: Provide a text box for the client to add comments or uploads to existing tickets.  
[ ] FRONTEND: Style the portal to match the "Sleek Tech + Business-Class" vibe and remain user-friendly.  
[ ] BACKEND: Ensure role="Client" is created or assigned properly if ORY user not found.  
[ ] BACKEND: Restrict GET /tickets?client_id=... to the logged-in client's own tickets.  
[ ] BACKEND: Restrict GET /tickets/:id to the ticket's owner.  
[ ] BACKEND: POST /tickets/:id/messages for client updates.  
[ ] BACKEND: Filter out is_internal_note for client-facing responses.  
[ ] FRONTEND: Test logging in as a client and verifying ticket visibility is limited to that client.  
[ ] FRONTEND: Attempt to add a comment; confirm agent sees the new message.  
[ ] FRONTEND: Verify end-to-end from ticket creation (agent) to client portal (client). 