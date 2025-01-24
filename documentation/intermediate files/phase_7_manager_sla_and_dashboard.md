# Phase 7: Manager SLA Setting & Dashboard

This phase gives managers the ability to set SLA durations and see a dashboard of open tickets, average resolution times, SLA breaches, and basic agent performance.

References:  
• @mvp_features.md (Basic Manager SLA Setting, Basic Manager Dashboard)  
• @User_stories.md (8.1, 8.2, 9.1, 9.2)  
• @high_level_overview.md (Manager flows)  

---

## Features Covered in Phase 7
1. SLA configuration (in hours) with warnings for near-breach tickets.  
2. Manager Dashboard with open ticket counts, average resolution time, agent performance.  

---

## Checklist

1. FRONTEND TASKS (React Remix)  
   1.1 SLA Settings Page:  
       - Route: /manager/sla for setting default resolution time in hours.  
       - Store new setting in the back end.  
   1.2 Manager Dashboard:  
       - Route: /manager/dashboard or /manager.  
       - Display: number of open tickets, average resolution time, SLA breach warnings.  
       - Summarize agent performance (tickets resolved, resolution times).  
   1.3 UI highlights:  
       - Tickets near SLA due are shown with a red or gold highlight (per @theme-rules.md).  

2. BACKEND TASKS (Core CRM)  
   2.1 SLAConfig table:  
       - Fields: id, default_resolution_hours, created_at, updated_at.  
   2.2 Logic to assign SLA due time to new tickets:  
       - ticket.sla_due_at = ticket.created_at + default_resolution_hours.  
   2.3 Manager Dashboard endpoints:  
       - GET /manager/dashboard:  
         - returns total open tickets, average resolution time, count of near-SLA or overdue tickets.  
         - returns basic agent stats (tickets assigned/resolved).  
   2.4 Restrict these endpoints to Manager role.  

3. TESTING & VERIFICATION  
   3.1 Confirm updating SLA:  
       - Manager sets 24 hours → new tickets have a sla_due_at +24h from creation.  
   3.2 Dashboard correctness:  
       - Force some tickets to exceed SLA; check they appear as overdue.  
       - Check agent performance numbers match actual tickets in DB.  