# Finance CRM MVP – Data Model Specification

This document defines the core data structures (tables, fields, and relationships) used in the Finance CRM MVP. It consolidates requirements from the various documents (@api_endpoints.md, @mvp_features.md, @User_stories.md, @high_level_overview.md, @tech-stack-rules.md, @ui-rules.md, @theme-rules.md, and Codebase Best Practices).

--------------------------------------------------------------------------------
## Overview

The minimum viable product consists of:
1. A Users & Roles system (with ORY for authentication and local role assignment).  
2. A Clients table for storing client-specific data (e.g., region, risk tolerance).  
3. A Ticketing system (tickets, messages, basic SLA, multi-channel creation).  
4. Bulk Email Campaigns for marketing updates.  
5. Optional data sets for AI (FAQ, RAG ingestion).  

All tables described below will typically reside in a relational database (e.g., PostgreSQL). Where indicated, certain fields may be optional or "MVP placeholders" for future expansions.

--------------------------------------------------------------------------------
## 1. Users & Roles

### 1.1 users
Stores all known users in the CRM, including Agents, Managers, and Clients (for self-service portal logins).  
• Some clients may exist only in the "client" table if they never log in; others will also exist here if they use the client portal.

| Field             | Type               | Description                                                                                                                       |
|-------------------|--------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| id                | SERIAL (PK)        | Primary key.                                                                                                                      |
| ory_identity_id   | VARCHAR            | The ID returned from ORY upon successful authentication (unique per identity in ORY).                                             |
| email             | VARCHAR            | User's email (must match ory_identity_id's email; updated if changed in ORY).                                                    |
| full_name         | VARCHAR            | User's display name (e.g., "Jane Doe"), optional business logic to keep in sync with ORY.                                         |
| role              | VARCHAR            | Local role assignment. Possible values: "Manager," "Agent," "Client," "Marketing," or "None."                                     |
| is_active         | BOOLEAN            | Whether the user is allowed to log in or perform actions. Could be toggled by a Manager.                                          |
| created_at        | TIMESTAMP          | Timestamp the record was created.                                                                                                 |
| updated_at        | TIMESTAMP          | Timestamp the record was last updated.                                                                                            |

Notes:  
• In some deployments, we might have a separate user_roles table for more fine-grained RBAC. For the MVP, a single string field "role" is sufficient.  
• If a newly authenticated user from ORY doesn't exist here, the system auto-creates them with role = "None" (unassigned) until a Manager updates the role if needed.

--------------------------------------------------------------------------------
## 2. Clients

### 2.1 clients
Stores detailed client information used by Agents and Managers. This may include data on region, risk tolerance, net worth, etc. If a client also has a user account (for the portal), you can link the two via an optional foreign key or a matching email.  

| Field             | Type               | Description                                                                                     |
|-------------------|--------------------|-------------------------------------------------------------------------------------------------|
| id                | SERIAL (PK)        | Primary key.                                                                                    |
| name              | VARCHAR            | Client's name (company or individual).                                                          |
| email             | VARCHAR            | Client's primary email. May or may not match a record in the users table.                       |
| phone             | VARCHAR (optional) | Contact phone number.                                                                           |
| region            | VARCHAR            | Geographical region or country (e.g., "APAC," "US," etc.).                                      |
| net_worth         | DECIMAL            | Approximate net worth or bracket (for segmentation).                                            |
| risk_tolerance    | VARCHAR            | E.g., "Low," "Medium," "High." Used for segmentation and marketing.                             |
| portfolio_summary | TEXT (optional)    | Simple textual summary of the client's portfolio (trading history, holdings, etc.).             |
| created_at        | TIMESTAMP          | Timestamp the record was created.                                                               |
| updated_at        | TIMESTAMP          | Timestamp the record was last updated.                                                          |

Notes:  
• Additional tables (e.g., client_portfolio, trades) could be added for more detailed finance data. The MVP often just references "portfolio_summary" or risk-level fields.  
• Managers can segment clients by region, net_worth, or risk_tolerance.

--------------------------------------------------------------------------------
## 3. Ticketing

### 3.1 tickets
Represents a single ticket in the system (service request, question, issue, etc.). Tickets can be created by agents, managers, or clients (via portal) and can arrive via multiple channels.

| Field            | Type         | Description                                                                                                          |
|------------------|------------- |----------------------------------------------------------------------------------------------------------------------|
| id               | SERIAL (PK)  | Primary key.                                                                                                         |
| subject          | VARCHAR      | Brief subject or title of the ticket.                                                                                |
| channel          | VARCHAR      | Origin: "chat," "email," "whatsapp," "portal," etc.                                                                  |
| status           | VARCHAR      | E.g., "new," "open," "pending," "resolved," "closed."                                                                |
| priority         | VARCHAR      | E.g., "normal," "high," "urgent" (optional in MVP, or set automatically near SLA breach).                            |
| assigned_agent_id| INT (FK→users.id) | Which agent is assigned to handle the ticket. Null if unassigned.                                     |
| client_id        | INT (FK→clients.id) | References the client record for this ticket. Could be null if not mapped to a specific client profile.    |
| sla_due_at       | TIMESTAMP    | Calculated date/time by which the ticket should be resolved, based on Manager's SLA setting.                          |
| created_at       | TIMESTAMP    | Timestamp the record was created.                                                                                   |
| updated_at       | TIMESTAMP    | Timestamp the record was last updated.                                                                               |

Notes:  
• If the user story calls for a "unread/new" concept, store it in the status or track it with a separate field (e.g., "unread" boolean).  
• The MVP only needs a minimal approach to priority; advanced rules can be introduced later.

### 3.2 ticket_messages
Each ticket can have multiple messages—either client-facing (public) or internal notes (only visible to agents/managers). Clients see only the public messages.

| Field             | Type         | Description                                                                                                 |
|-------------------|------------- |-------------------------------------------------------------------------------------------------------------|
| id                | SERIAL (PK)  | Primary key.                                                                                                |
| ticket_id         | INT (FK→tickets.id) | Which ticket this message belongs to.                                                                 |
| sender_user_id    | INT (FK→users.id, nullable) | The user who wrote this message (Agent, Manager, or Client). Null if we store unregistered senders.|
| message_body      | TEXT         | The main text of the note/message.                                                                          |
| is_internal_note  | BOOLEAN      | Whether this message is internal (agents/managers only) or client-facing.                                  |
| created_at        | TIMESTAMP    | Timestamp for when the message was created/sent.                                                           |

Notes:  
• Additional fields can be used for attachments, rich formatting, or referencing external files.  
• If a client is not registered in the users table (e.g., chat or email channel with no login), either store an alternate sender identifier or keep sender_user_id = null plus a "sender_name" field.

--------------------------------------------------------------------------------
## 4. SLA & Manager Dashboard

### 4.1 sla_config
Managers can define a default SLA duration (in hours) for newly created tickets. The system calculates sla_due_at on a ticket accordingly.

| Field                  | Type         | Description                                                                                         |
|------------------------|------------- |-----------------------------------------------------------------------------------------------------|
| id                     | SERIAL (PK)  | Primary key.                                                                                        |
| resolution_target_hours| INT          | Default number of hours to resolve a ticket before it's considered late or "breaching."             |
| created_at             | TIMESTAMP    | Timestamp the record was created.                                                                   |
| updated_at             | TIMESTAMP    | Timestamp the record was last updated.                                                              |

Notes:  
• If you allow multiple SLA configurations (e.g., different defaults by region or client tier), add more fields or a separate table. For MVP, a single global default is enough.

--------------------------------------------------------------------------------
## 5. Bulk Email & Marketing

### 5.1 bulk_email_campaigns
Stores information about marketing or system-wide emails sent to clients.

| Field              | Type         | Description                                                                                           |
|--------------------|------------- |-------------------------------------------------------------------------------------------------------|
| id                 | SERIAL (PK)  | Primary key.                                                                                          |
| subject            | VARCHAR      | Subject line of the email.                                                                            |
| body               | TEXT         | Main content/body of the email.                                                                       |
| audience_segment   | VARCHAR      | Optional descriptor (e.g. "All Clients," "High Net Worth," etc.)                                      |
| sent_at            | TIMESTAMP    | When the campaign was sent.                                                                           |
| open_count         | INT          | Number of opens recorded (tracked via open pixel or link).                                            |
| unsubscribe_count  | INT          | Number of unsubscribes recorded after this campaign.                                                  |
| created_at         | TIMESTAMP    | Timestamp the record was created.                                                                     |
| updated_at         | TIMESTAMP    | Timestamp the record was last updated.                                                                |

Notes:  
• For more advanced marketing, you might store each recipient in a related table (bulk_email_recipients) to track opens/unsubscribes individually.  
• MVP only requires open counts and unsubscribes at an aggregate level.

--------------------------------------------------------------------------------
## 6. Optional: FAQ & RAG (AI-Related)

### 6.1 faqs
Auto-generated or manually curated frequent questions. Stored to help Agents quickly reference answers or to display in the client portal.

| Field       | Type         | Description                                                           |
|-------------|------------- |-----------------------------------------------------------------------|
| id          | SERIAL (PK)  | Primary key.                                                          |
| question    | TEXT         | The frequently asked question.                                        |
| answer      | TEXT         | The recommended answer or explanation.                                |
| created_at  | TIMESTAMP    | Timestamp the record was created.                                     |
| updated_at  | TIMESTAMP    | Timestamp the record was last updated.                                |

Notes:  
• If your AI app auto-generates this content, store the result here for Agents/Managers to edit or approve.

### 6.2 rag_documents (Optional)
Used if implementing RAG (Retrieval-Augmented Generation) for the AI. Agents or Managers can ingest PST/email content for the AI to reference.

| Field         | Type         | Description                                                                              |
|---------------|------------- |------------------------------------------------------------------------------------------|
| id            | SERIAL (PK)  | Primary key.                                                                             |
| source_type   | VARCHAR      | E.g., "pst," "email," "manual," "web_crawl," etc.                                       |
| source_info   | TEXT         | Additional metadata (e.g., email address, PST file name, or relevant notes).            |
| content_text  | TEXT         | The raw or partially processed text to index for vector search.                          |
| created_at    | TIMESTAMP    | Timestamp the record was created.                                                        |
| updated_at    | TIMESTAMP    | Timestamp the record was last updated.                                                   |

Notes:  
• In an MVP, this might not be fully implemented. If using an external vector store (Faiss, Pinecone, etc.), you might store only minimal metadata.

--------------------------------------------------------------------------------
## 7. Data Relationships & Diagrams (Conceptual)

- A User can have (role = "Agent"/"Manager"/"Client") and can be assigned to multiple tickets. 
- A Client is distinct from a User unless the client logs into the portal (in which case the client's email or ID may map to a user record). 
- A Ticket references a single Client (if known) and optionally an assigned Agent (User). 
- A Ticket has many TicketMessages. Each TicketMessage references a sender_user_id (if available). 
- Managers can set a single SLA config row that applies to all tickets by default. 
- BulkEmailCampaign tracks marketing emails sent to some client segment. 
- FAQ can be generated by the AI Service or manually added. 
- RAG Documents are optional but can be stored for advanced AI lookups.

--------------------------------------------------------------------------------
## 8. Final Notes & Best Practices

1. Timestamps:  
   • Use created_at and updated_at fields for auditing. Many ORMs (TypeORM, Prisma, Sequelize) can auto-manage these fields.  

2. Indexes:  
   • Commonly index foreign keys (e.g., assigned_agent_id, client_id) to speed up queries for tickets.  
   • For large volumes of data (tickets, or RAG documents), plan indexes carefully to maintain performance.  

3. Data Integrity & Transactions:  
   • Use transactions for multi-step operations (e.g., create ticket + first message).  
   • Validate references (e.g., user must exist before assigning as an agent).  

4. Role Enforcement:  
   • Ensure your service-layer or route-layer has checks so that only Managers can update `role`, SLAs, or certain dashboards.  
   • Agents should only see relevant tickets, while Clients see only their own.  

5. Further Extensions:  
   • Additional tables (e.g., "agent_stats," "client_segments," etc.) can be introduced as the system evolves.  
   • For advanced portfolio data or compliance disclaimers, more finance-specific tables will be necessary.

--------------------------------------------------------------------------------

By defining these tables and fields carefully now, the Finance CRM MVP will accommodate user management (ORY + local roles), client data, multi-channel ticketing, basic SLA rules, and optional AI expansions (FAQ, PST ingestion). As the product grows, these schemas can be refactored or extended without losing the fundamental relationships needed for the MVP feature set. 