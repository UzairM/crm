# API Endpoints for Finance CRM MVP

This document defines all API endpoints that the React Remix front-end will use to interact with both the Core CRM (Node.js + Express) and the AI Service (Python + FastAPI). These endpoints are derived from the MVP features and user stories covered in:

- @high_level_overview.md  
- @mvp_features.md  
- @User_stories.md  
- @tech-stack-rules.md  
- @ui-rules.md  
- @theme-rules.md  
- @codebase-best-practices.md  

They address ticketing, client management, AI-suggested responses, auto-generated FAQs, multi-channel ticket creation, bulk email, email/PST ingestion (RAG), manager SLA/dashboards, and a client portal.

---

## Table of Contents

1. [General Structure & Conventions](#general-structure--conventions)  
2. [Authentication & User Endpoints](#1-authentication--user-endpoints)  
3. [Role Management Endpoints](#2-role-management-endpoints)  
4. [Tickets & Messages Endpoints](#3-tickets--messages-endpoints)  
5. [Clients & Segmentation Endpoints](#4-clients--segmentation-endpoints)  
6. [Bulk Email & Marketing Endpoints](#5-bulk-email--marketing-endpoints)  
7. [SLA & Manager Dashboard Endpoints](#6-sla--manager-dashboard-endpoints)  
8. [Client Portal Endpoints](#7-client-portal-endpoints)  
9. [AI Service Endpoints](#8-ai-service-endpoints)

---

## General Structure & Conventions

• All endpoints are prefixed with /api in the Core CRM unless otherwise noted.  
• Authentication with ORY is performed client-side, then the resulting token is passed to the Core CRM via an Authorization header (Bearer token) for protected endpoints.  
• Date/time fields use ISO 8601 format (e.g., 2023-11-08T12:34:56Z).  
• For brevity, examples below often reference how requests might be structured without showing actual code snippets.  
• All requests to the AI Service are typically from the Core CRM but can be direct from the frontend if the architecture allows.

---

## 1. Authentication & User Endpoints

### 1.1 GET /api/users/me
Checks if an ORY-authenticated user (based on the Bearer token) exists in the local CRM DB. If not, creates a new user record with no assigned role. Returns the user data.

• Protected: Yes.  
• Roles allowed: Any authenticated user (Agent, Manager, Client).  

Example Success Response Body:

[Removed snippet]

---

## 2. Role Management Endpoints

Managers can assign roles (e.g., "Agent", "Manager", "Client") to a local user for RBAC in the Core CRM.

### 2.1 POST /api/users/:id/role
Assign or update the local role for a user.

• Protected: Yes.  
• Roles allowed: Manager only.  
• Body fields:  
  - role (string) → "Agent" | "Manager" | "Client"

Example Body:

[Removed snippet]

Example Success Response:

[Removed snippet]

---

## 3. Tickets & Messages Endpoints

### 3.1 POST /api/tickets
Create a new ticket.  
Channels can be "chat", "email", "whatsapp", etc.

• Protected: Yes (Client can create if done through the portal or a logged-in context; or system can create from inbound chat/email).  
• Roles allowed:  
  - Client: can create a ticket in context.  
  - Agent/Manager: can create on behalf of a client.

Example Body:

[Removed snippet]

Example Success Response:

[Removed snippet]

---

### 3.2 GET /api/tickets
Retrieve a list of tickets, optionally filtered by status (e.g., "open", "unread", "closed") or assignedAgentId.

• Protected: Yes.  
• Roles allowed: Agent, Manager (Clients see only their own tickets in the portal—see Client Portal Endpoints).  
• Query params (optional): status, assignedAgentId, channel, search.

Example Response (array of tickets):

[Removed snippet]

---

### 3.3 GET /api/tickets/:id
Retrieve full detail of a single ticket, including messages (public and internal).

• Protected: Yes.  
• Roles allowed: Agent, Manager, or Client if it is their ticket.

Example Response:

[Removed snippet]

---

### 3.4 POST /api/tickets/:id/messages
Add a message or internal note to an existing ticket.

• Protected: Yes.  
• Roles allowed:  
  - Agent, Manager → can post client-facing or internal messages.  
  - Client → can post client-facing comments only.

Example Body:

[Removed snippet]

Example Success Response:

[Removed snippet]

---

### 3.5 PATCH /api/tickets/:id
Update ticket status, priority, or assignedAgentId (e.g., an Agent picks up a ticket).

• Protected: Yes.  
• Roles allowed: Agent, Manager.

Example Body (change status and assign to agent):

[Removed snippet]

Example Success Response:

[Removed snippet]

---

## 4. Clients & Segmentation Endpoints

### 4.1 POST /api/clients
Create a new client record.

• Protected: Yes (Manager or Agent).  
• Roles allowed: Manager, Agent.

Example Body:

[Removed snippet]

Example Success Response:

[Removed snippet]

---

### 4.2 GET /api/clients
List or filter clients by region, netWorth range, or riskTolerance.

• Protected: Yes.  
• Roles allowed: Manager, Agent.  
• Query params (optional): region, netWorthMin, netWorthMax, riskTolerance, search.

Example Response:

[Removed snippet]

---

### 4.3 GET /api/clients/:id
Retrieve a single client's data, including relevant profile fields.

• Protected: Yes.  
• Roles allowed: Manager, Agent (Clients see their own profile through the portal).

Example Success Response:

[Removed snippet]

---

### 4.4 PATCH /api/clients/:id
Update client info (e.g., netWorth, region, riskTolerance).

• Protected: Yes.  
• Roles allowed: Manager, Agent.

Example Body:

[Removed snippet]

Example Success Response:

[Removed snippet]

---

## 5. Bulk Email & Marketing Endpoints

### 5.1 POST /api/bulk-email
Create and send a new bulk email campaign to all or segmented clients.

• Protected: Yes.  
• Roles allowed: Manager or "Marketing Specialist" role.  
• Body fields:  
  - subject (string)  
  - body (string)  
  - segmentCriteria (object?) – optional for segmentation

Example Body:

[Removed snippet]

Example Success Response:

[Removed snippet]

---

### 5.2 GET /api/bulk-email/:id/metrics
Retrieve basic open/unsubscribe stats for a sent campaign.

• Protected: Yes.  
• Roles allowed: Manager, Marketing Specialist

Example Response:

[Removed snippet]

---

## 6. SLA & Manager Dashboard Endpoints

### 6.1 POST /api/sla/config
Set the default SLA resolution target (in hours).

• Protected: Yes.  
• Roles allowed: Manager.

Example Body:

[Removed snippet]

Example Success Response:

[Removed snippet]

---

### 6.2 GET /api/manager/dashboard
Get manager-level stats: number of open tickets, average resolution time, upcoming SLA breaches, basic agent performance, etc.

• Protected: Yes.  
• Roles allowed: Manager.

Example Response:

[Removed snippet]

---

## 7. Client Portal Endpoints

### 7.1 GET /api/portal/my-tickets
List tickets for the logged-in client only.

• Protected: Yes.  
• Roles allowed: Client.

Example Response:

[Removed snippet]

---

### 7.2 GET /api/portal/my-tickets/:ticketId
Show a single ticket's messages, excluding internal notes from agents.

• Protected: Yes.  
• Roles allowed: Client (only for that client's ticket).

Example Response:

[Removed snippet]

---

### 7.3 POST /api/portal/my-tickets/:ticketId/comments
Client adds a new comment or update to their existing open ticket.

• Protected: Yes.  
• Roles allowed: Client (owner of the ticket).

Example Body:

[Removed snippet]

Example Success Response:

[Removed snippet]

---

## 8. AI Service Endpoints

### 8.1 POST /ai/ai-suggested-reply
Generate an AI-suggested response given the ticket context.

• Protected: Could be restricted by a shared secret or token.  
• Request Body:  
  - ticketId (number)  
  - recentMessages (array of message objects)  
  - knowledgeBaseRefs (boolean) – whether to include references from a small knowledge base

Example Request Body:

[Removed snippet]

Example Success Response:

[Removed snippet]

---

### 8.2 POST /ai/auto-generate-faq
Triggers AI to scan recent tickets for common questions, producing a draft FAQ section.

• Protected: Yes (Manager or authorized system user).  
• Request Body (optional time/window or number of tickets to scan).

Example Response:

[Removed snippet]

---

### 8.3 POST /ai/ingest-pst
For uploading PST files or connecting IMAP to populate the RAG knowledge base.

• Protected: Manager or Agent.  
• Body can include a file upload or IMAP credentials. The AI service indexes the content for future expansions.

Minimal Example (IMAP-based JSON):

[Removed snippet]

Example Response:

[Removed snippet]

---

## Conclusion

These endpoints form the backbone of the Finance CRM MVP. By following the principles in @tech-stack-rules.md, @ui-rules.md, @theme-rules.md, and @codebase-best-practices.md, each route stays concise in its logic, uses consistent naming, and implements robust role-based access. The AI Service endpoints can be invoked either directly from the frontend (if permitted) or from the Core CRM as an internal service call. This ensures a scalable, maintainable architecture where Agents, Managers, and Clients all have controlled access to the CRM's data and AI capabilities.
