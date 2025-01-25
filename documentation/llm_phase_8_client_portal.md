# Phase 8 (Flattened Checklist)

[x] FRONTEND: Create a /portal or /client route accessible only if user.role == "Client". 
[x] FRONTEND: Create a UI Element for Client to add a ticket
[x] FRONTEND: Show open vs. closed tickets for the logged-in client.  
[x] FRONTEND: Link to a ticket detail page that displays the conversation (excluding internal agent notes).  
[x] FRONTEND: Provide a text box for the client to add comments or uploads to existing tickets.  
[x] FRONTEND: Style the portal to match the "Sleek Tech + Business-Class" vibe and remain user-friendly.  
[x] BACKEND: Ensure role="Client" is created or assigned properly if ORY user not found.  
[x] BACKEND: Restrict GET /tickets?client_id=... to the logged-in client's own tickets.  
[x] BACKEND: Restrict GET /tickets/:id to the ticket's owner.  
[x] BACKEND: POST /tickets/:id/messages for client updates.  
[x] BACKEND: Filter out is_internal_note for client-facing responses.  
[x] FRONTEND: Test logging in as a client and verifying ticket visibility is limited to that client.  
[x] FRONTEND: Attempt to add a comment; confirm agent sees the new message.  
[x] FRONTEND: Verify end-to-end from ticket creation (agent) to client portal (client). 