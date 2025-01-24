# Phase 5 (Flattened Checklist)

[ ] FRONTEND: Add a "Generate AI Suggestion" button on the TicketDetail page.  
[ ] FRONTEND: On button click, call an action that requests an AI suggestion from the Core CRM.  
[ ] FRONTEND: Display the suggested text in a text area for agent review/edit.  
[ ] FRONTEND: Show an error or alert if the AI call fails.  
[ ] BACKEND: In /services/core-crm, create an endpoint (POST /tickets/:id/ai-suggestion) to gather data & call AI service.  
[ ] BACKEND: Possibly create an AIIntegration or AIPipeline utility to handle sentiment flags or KB references.  
[ ] BACKEND: Forward relevant ticket info (last client message, etc.) to the AI service.  
[ ] BACKEND: In /services/ai-service, add /ai-suggested-reply endpoint that receives ticket text, tone, etc.  
[ ] BACKEND: Return a recommended text (use a placeholder model or external LLM).  
[ ] BACKEND: (Optional) Implement RAG with a vector store or minimal doc search.  
[ ] FRONTEND: Confirm the round-trip flow: agent clicks, AI text appears, agent reviews.  
[ ] FRONTEND: Check edge cases (no client data, minimal text).  
[ ] BACKEND: Ensure no advanced disclaimers or compliance checks for MVP. 