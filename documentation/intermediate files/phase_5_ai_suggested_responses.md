# Phase 5: AI-Suggested Responses & RAG (Optional)

Implement a minimal AI pipeline where the agent can request an AI-suggested reply for a given ticket. If RAG (Retrieval-Augmented Generation) is used, we'll connect the AI service to an optional vector store.

References:  
• @mvp_features.md (Basic AI-Suggested Responses)  
• @User_stories.md (User Story 3.1, 3.2)  
• @high_level_overview.md (AI service integration flow)  
• @tech-stack-rules.md (3. AI Service, mention RAG)  

---

## Features Covered in Phase 5
1. AI-suggested reply generation from the AI Service (sentiment + knowledge base lookup).  
2. Optional RAG hooking if the phase includes a vector store or simple in-memory knowledge base.  

---

## Checklist

1. FRONTEND TASKS (React Remix)  
   1.1 AI Suggestion Button:  
       - On the TicketDetail page, add a "Generate AI Suggestion" button.  
       - Clicking it calls an action that hits the Core CRM, which then queries the AI Service.  
   1.2 Display AI suggestion:  
       - Show the suggested text in a text area where the support agent can review/edit.  
       - Provide an "Accept" or "Cancel" button.  
   1.3 UI feedback:  
       - If the AI call fails, show an alert or error message.  

2. BACKEND TASKS (Core CRM)  
   2.1 Endpoint for AI request:  
       - Possibly POST /tickets/:id/ai-suggestion.  
       - Gathers ticket data, last client message, etc., then calls the AI service.  
   2.2 AIIntegration or AIPipeline service:  
       - Incorporate any needed transformations (e.g., sentiment analysis flags, minimal KB references).  
       - Send the data to AI service.  

3. BACKEND TASKS (AI Service)  
   3.1 /ai-suggested-reply endpoint:  
       - Input: ticket text, client tone, basic historical replies (optional).  
       - Output: recommended text.  
       - Use a placeholder model or external LLM API call.  
   3.2 Optional RAG integration:  
       - If you have ingested documents or PST files, do a quick vector search.  
       - Return relevant FAQ or historical snippets in the suggested reply.  

4. TESTING & VERIFICATION  
   4.1 Confirm successful round-trip:  
       - Agent clicks "Generate AI Suggestion."  
       - AI service returns text, displayed for agent.  
   4.2 Edge cases:  
       - No client data or minimal text – the AI might produce generic suggestions.  
       - Ensure no advanced disclaimers or compliance checks beyond MVP.  

5. UI/UX Enhancements  
   5.1 Provide a "confidence" or "source" label if the AI includes relevant references from a knowledge base.  
   5.2 Keep the design simple as per @ui-rules.md and @theme-rules.md. 