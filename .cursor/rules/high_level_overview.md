# Finance CRM MVP: Two-Service Approach (Core + AI) with React Frontend

This document describes a Finance CRM MVP that uses:  
• A React frontend (TypeScript) with ORY SDK for in-app login.  
• Two backend microservices:  
  1. Core CRM Service (TypeScript).  
  2. AI Service (Python).  

The system handles ticketing, client management, AI-suggested responses, auto-generated FAQs, multi-channel ticket creation, bulk email, email/PST ingestion (RAG), manager SLA and dashboards, client portals, and a local role assignment mechanism. ORY SDK is used on the frontend to authenticate users, then the CRM stores and manages user roles (Agent, Manager, Client, etc.).

---

## 1. Architecture Overview

     ┌───────────────────────────────────┐
     │   React Frontend (ORY SDK) │
     │   TypeScript + UI for Agents,    │
     │   Managers, Clients              │
     └───────────────┬──────────────────┘
                     │ (HTTPS)
 ┌───────────────────▼───────────────────┐       ┌─────────────────────────────┐
 │      Core CRM Service (TypeScript)    │ <---->│  AI Service (Python)       │
 │  - Ticket mgmt                        │       │  - LLM-based responses     │
 │  - Client DB, SLA, Bulk Email, etc.   │       │  - FAQ generation, RAG     │
 │  - Local role assignment (Manager)    │       └───────────┬────────────────┘
 │  - Stores user record after ORY login │                   │
 └─────────────────┬─────────────────────┘             ┌─────▼─────────┐
                   │                                   │ Vector DB/RAG │ (Optional)
                   │                                   └───────────────┘
                   │
             (Relational DB)
               - Users, Roles
               - Tickets, SLA
               - BulkEmail, etc.

---

## 2. MVP Features & Flows

1) Basic Support Agent UI  
   • React pages for Agents: ticket lists, detail views, internal notes, unread/new sorting.  
   • ORY SDK handles login on the frontend; once the user is authenticated, the UI calls the Core CRM to check if the user record exists locally. If not, the CRM creates a new record referencing the user's ORY identity.  
   • After local user creation, a Manager can assign a role (e.g., Agent).  

2) Basic Unified Client Database & Segmentation  
   • Single relational DB table for client data (name, net worth, region, risk category, etc.).  
   • UI for Agents/Managers to search, filter, and update client info.  

3) Basic AI-Suggested Responses  
   • Frontend calls Core CRM to retrieve a ticket's data, which in turn requests AI suggestions from the AI Service.  
   • AI Service uses minimal knowledge base references and sentiment checks to propose a response.  

4) Auto-Generated FAQ  
   • Manager triggers an FAQ generation call to the AI Service; the AI Service scans recent tickets.  
   • The resulting FAQ can be stored in the Core CRM database or in a separate content repository.  

5) Multi-Channel Ticket Creation  
   • Website Chat → Direct POST to Core CRM with channel="chat".  
   • Email → Email hooking or polling that creates a new ticket in the CRM.  
   • WhatsApp → Dedicated webhook (e.g. Twilio or WhatsApp API) that posts to the CRM.  
   • All feed the same queue, displayed in the Agents' UI.  

6) Basic Bulk Email for Marketing  
   • Manager or Marketing role composes new campaign from the CRM.  
   • The system updates open rates and unsubscribes in the BulkEmailCampaign table.  

7) Email/PST Ingestion for RAG Database  
   • (Optional in MVP) Agents/Managers can upload PST or connect IMAP.  
   • The AI Service indexes the content for retrieval-based context in future AI suggestions.  

8) Basic Manager SLA & High Priority Warnings  
   • Manager sets a default SLA in "SLAConfig" table.  
   • Tickets nearing SLA get flagged in the UI for Agents.  
   • Manager sees an SLA warning dashboard.  

9) Manager Dashboard  
   • Manager role sees total open tickets, average resolution time, SLA breach warnings, agent performance stats.  

10) Basic Client Ticket Portal  
   • Clients log in via ORY; if no local DB record, one is created with role "Client" by default or by Manager assignment.  
   • The portal only displays that client's tickets.  
   • The client can add updates/comments; the CRM notifies the assigned Agent.  

---

## 3. Userflows & Data Handling

1) ORY Login Flow with Local Role Sync  
   • The user opens the React app and initiates login via the ORY SDK.  
   • On success, the frontend obtains ID & tokens from ORY.  
   • The frontend calls "GET /users/me" (CRM endpoint) with the ID token.  
   • The Core CRM checks if this ORY ID exists in the local DB. If not, it creates a record in the "User" table with no assigned role.  
   • A Manager can use the Manager UI to assign the new user a local role (Agent, Client, etc.).  

2) Agent Viewing Tickets  
   • Agents see their "unread/new" tickets.  
   • Clicking a ticket retrieves full conversation details (and potentially an AI suggestion).  

3) Manager Setting SLA & Monitoring Dashboard  
   • Manager logs in (via ORY SDK), the CRM sees manager role = "Manager."  
   • Manager sets resolution target hours in the SLAConfig table.  
   • The dashboard displays ticket stats, average handle time, upcoming SLA breaches, etc.  

4) Multi-Channel Ticket Creation  
   • CRM has endpoints that create new tickets from chat, email, or WhatsApp.  
   • The channel type is recorded so Agents see the origin.  

5) AI-Suggested Reply  
   • When the Agent opens a ticket, the Core CRM calls AI microservice with relevant data.  
   • The AI microservice runs sentiment analysis, retrieves knowledge from RAG if available, and returns a suggested text.  
   • The CRM sends this suggestion back to the frontend for display.  

6) Client Portal  
   • Clients log in via ORY; if no local DB record, one is created with role "Client" by default or by Manager assignment.  
   • The portal only displays that client's tickets.  
   • The client can add updates/comments; the CRM notifies the assigned Agent.  

---

## 4. Tech Stack & Modules

• React Frontend (ORY SDK)  
  – TypeScript-based.  
  – ORY SDK for embedded login (no separate hosted page required).  
  – Components/Routes: /login, /dashboard, /manager, /portal, /clients, /bulk-email.  

• Core CRM Service (TypeScript, Express )  
  – Modules:  
    1. Auth Integration with ORY (parse the token from ORY, local DB sync).  
    2. Ticketing (CRUD endpoints).  
    3. Client Database (CRUD endpoints, segmentation).  
    4. Bulk Email (mark campaigns, track opens/unsubscribes).  
    5. SLA & Manager Dashboard.  
    6. AIIntegration Client module (makes HTTP calls to AI Service).  
    7. Role Management (Manager can assign roles to a local user).  

• AI Service (Python, FastAPI)  
  – Endpoints:  
    1. /ai-suggested-reply (sentiment + LLM generation).  
    2. /auto-generate-faq (scans tickets for repeated questions).  
    3. /ingest-pst or /connect-email (optional RAG ingestion).  

• Database (PostgreSQL)  
  – Tables:  
    1. user (id, ory_identity_id, name, email, etc.)  
    2. user_roles (user_id, local_role)  
    3. client (id, name, region, riskLevel, netWorth, etc.)  
    4. ticket (id, subject, priority, assignedAgentId, clientId, status, channel, etc.)  
    5. ticket_message (id, ticketId, sender, text, isInternalNote, etc.)  
    6. sla_config, bulk_email_campaign, etc.  

• Vector Store (Optional)  
  – AI Service uses it for advanced retrieval-based prompts.  

---

## 5. Security & Roles

1. ORY for Identity  
   • The React app uses ORY's SDK to handle login forms locally.  
   • On success, the user receives a session or token from ORY.  

2. Local Role Assignment  
   • Manager uses a special UI to assign the user a local role.  
   • The CRM enforces role-based endpoints: e.g., only a Manager can set SLA or see certain dashboards.  

3. Data Access  
   • Agents can see ticket details, client data.  
   • Managers have extended rights (SLA, dashboards, user role assignment).  
   • Clients see only their own tickets and can add comments.  

---

## 6. Step-by-Step Implementation Outline

1) Configure ORY  
   • Setup an ORY project, retrieve the necessary credentials.  
   • In the React app, install the ORY SDK and configure the environment variables.  

2) Build the Frontend with ORY SDK  
   • A /login route that uses ORY's SDK to handle user credentials.  
   • On success, store the session tokens.  
   • An authenticated layout that checks if the user is recognized by the CRM.  

3) Core CRM – User & Role Database  
   • Create a "User" table referencing the ORY identity ID.  
   • Create a separate "Roles" table or a column in "User" for local roles.  
   • Expose endpoints for "GET /users/me" to fetch or create a local user record based on the ORY ID.  
   • Expose endpoints for "POST /users/:id/role" to allow a Manager to set roles.  

4) Ticketing, Clients, Bulk Email, SLA Modules  
   • Implement standard CRUD endpoints for tickets, messages, clients.  
   • Manager SLA endpoints: store resolution hours, detect near-deadline tickets.  
   • Bulk Email: track send, open, unsubscribe metrics.  

5) AI Service  
   • "/ai-suggested-reply" for generating text suggestions.  
   • Additional optional endpoints for /auto-generate-faq, /ingest-email, etc.  

6) React UI  
   • Agent Dashboard: list unread tickets, show ticket details, request AI suggestions.  
   • Manager Views: set SLA, assign roles, see dashboards.  
   • Client Portal: see user's own tickets, add comments.  

7) Testing & Deployment  
   • Ensure login flow works end to end (ORY -> CRM user sync -> assigned roles).  
   • Validate role-based access to manager vs. agent vs. client.  
   • Test AI endpoint calls.  

---

## 7. Future Extensions

1. Deeper ORY Integration  
   • Use Ory Permissions (Keto) for advanced access control logic if needed.  

2. Advanced AI Compliance  
   • Monitor and embed disclaimers for finance-based replies.  

3. Real-Time Notifications  
   • Integrate with Slack or email alerts for urgent tickets.  

4. Automated Marketing  
   • Expand the Bulk Email feature to handle drip campaigns, personalized messaging, etc.  

5. Scalability & Microservices  
   • Split out additional microservices (notifications, advanced analytics, etc.) as needed.  

---

## Conclusion

With ORY SDK integration on the React frontend, the login flow remains a seamless in-app experience. Upon successful ORY authentication, the Core CRM Service checks for an existing local user record or creates one on the fly. A Manager can then set local roles. This meets all MVP requirements for a two-service Finance CRM architecture (Core + AI), including ticketing, AI-assisted replies, multi-channel ingestion, bulk email marketing, client portal, and manager controls (SLA, user roles, dashboards). This architecture can be extended with advanced AI and marketing automation as business needs evolve.

