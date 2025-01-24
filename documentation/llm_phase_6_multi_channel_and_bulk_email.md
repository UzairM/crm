# Phase 6 (Flattened Checklist)

[ ] FRONTEND: Implement a website chat widget or custom form that creates tickets (channel="chat").  
[ ] FRONTEND: Add a "Bulk Email" route for managers/marketing with a form (subject, body, recipient segmentation).  
[ ] FRONTEND: Display past campaigns: subject, launch date, open_count, unsubscribe_count.  
[ ] BACKEND: In /services/core-crm, create or modify POST /tickets to accept channel="chat".  
[ ] BACKEND: For email ingestion, set up a polling or webhook approach to create new tickets (channel="email").  
[ ] BACKEND: For WhatsApp ingestion, configure Twilio or relevant API to POST /tickets with channel="whatsapp".  
[ ] BACKEND: Create "bulk_email_campaigns" table (fields: id, subject, body, segment_criteria, created_at, launched_at, open_count, unsubscribe_count).  
[ ] BACKEND: POST /bulk-email to create & send campaigns; GET /bulk-email to list.  
[ ] BACKEND: Insert a tracking pixel or link for opens (GET /bulk-email/open/:campaign_id).  
[ ] BACKEND: Provide unsubscribe link (GET /bulk-email/unsubscribe/:campaign_id).  
[ ] FRONTEND: Test multi-channel ticket creation.  
[ ] FRONTEND: Test sending a bulk email campaign.  
[ ] BACKEND: Verify open_count increments on tracking pixel hits, unsubscribes recorded.  
[ ] FRONTEND: Keep the Bulk Email UI minimal but consistent with the theme.  
[ ] FRONTEND: Ensure chat branding aligns with the "Sleek Tech + Continental" vibe. 