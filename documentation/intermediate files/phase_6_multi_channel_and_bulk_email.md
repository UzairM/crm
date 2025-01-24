# Phase 6: Multi-Channel Ticket Creation & Bulk Email Marketing

This phase allows ticket creation from various external channels (chat, email, WhatsApp) and adds a basic Bulk Email feature for marketing to clients.

References:  
• @mvp_features.md (Multi-Channel Ticket Creation, Basic Bulk Email)  
• @User_stories.md (User Story 5.1, 5.2 for multi-channel; 6.1, 6.2 for bulk email)  

---

## Features Covered in Phase 6
1. Multi-channel ticket ingestion (website chat, email, WhatsApp).  
2. Bulk Email sending (with open/unsubscribe metrics).  

---

## Checklist

1. FRONTEND TASKS (React Remix) – Chat & Bulk Email UI  
   1.1 Website Chat:  
       - Basic chat widget (could be a separate library or a custom form).  
       - On submission, call the Core CRM endpoint to create a new ticket (channel="chat").  
   1.2 Bulk Email Admin UI:  
       - A "Bulk Email" route for the Manager/Marketing role.  
       - Editor form: subject, body, choose recipients (all clients or segments).  
       - A table or list of past campaigns with open/unsubscribe stats.  

2. BACKEND TASKS (Core CRM) – Multi-Channel  
   2.1 Chat ingestion:  
       - POST /tickets?channel=chat with the message text.  
   2.2 Email ingestion:  
       - Either via a polling or webhook approach. Store messages as new tickets if not recognized.  
   2.3 WhatsApp ingestion:  
       - Configure a Twilio or relevant API webhook that leads to POST /tickets?channel=whatsapp.  

3. BACKEND TASKS (Core CRM) – Bulk Email  
   3.1 "bulk_email_campaigns" table:  
       - Fields: id, subject, body, segment_criteria, created_at, launched_at, open_count, unsubscribe_count.  
   3.2 Endpoints for campaign management:  
       - POST /bulk-email to create & send.  
       - GET /bulk-email to list campaigns and stats.  
   3.3 Tracking opens/unsubscribes:  
       - Insert a tracking pixel (unique link) that calls GET /bulk-email/open/:campaign_id.  
       - unsubscribe link calls GET /bulk-email/unsubscribe/:campaign_id.  

4. TESTING & VERIFICATION  
   4.1 Multi-channel ticket test:  
       - Submit a chat message, confirm a new ticket with channel="chat."  
       - (Optional) Email test with a mock mailbox or real webhook.  
   4.2 Bulk Email test:  
       - Send an email from the new UI.  
       - Check open_count increments if the tracking pixel is hit.  
       - Check unsubscribes are recorded properly.  

5. UI/UX & Performance Considerations  
   5.1 Keep Bulk Email design minimal as per MVP, but follow @ui-rules.md.  
   5.2 For chat, ensure branding matches the "Sleek Tech + Continental" vibe from @theme-rules.md. 