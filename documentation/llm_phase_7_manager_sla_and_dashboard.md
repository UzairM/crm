# Phase 7 (Flattened Checklist)

[ ] FRONTEND: Create /manager/sla route for setting default resolution time in hours.  
[ ] FRONTEND: Store new SLA settings in the backend.  
[ ] FRONTEND: Create /manager/dashboard to display open tickets, average resolution time, SLA breaches, agent performance.  
[ ] FRONTEND: Highlight near-SLA or overdue tickets in red or gold.  
[ ] BACKEND: Create SLAConfig table (id, default_resolution_hours, timestamps).  
[ ] BACKEND: On ticket creation, set ticket.sla_due_at = created_at + default_resolution_hours.  
[ ] BACKEND: Add GET /manager/dashboard to return open ticket counts, average resolution time, near-SLA tickets, agent stats.  
[ ] BACKEND: Restrict these endpoints to the Manager role.  
[ ] FRONTEND: Test SLA updates (e.g., 24-hour resolution).  
[ ] BACKEND: Force some tickets to exceed SLA and confirm they appear as overdue.  
[ ] BACKEND: Confirm agent performance metrics match the real data. 