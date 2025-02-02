# UI Rules & Guidelines

This document details the UI principles drawn from @User_stories.md, @high_level_overview.md, and @tech-stack-rules.md. It emphasizes a primarily minimalist aesthetic with gentle neumorphism elements, ensuring a user-friendly, responsive interface for Agents, Managers, and Clients working long hours.

---

## 1. Responsiveness & Accessibility

• Adopt a mobile-first approach for all components, with clear breakpoints (e.g., 576px, 768px, 992px).  
• Ensure high color contrast between text and backgrounds for readability (WCAG AA).  
• Provide keyboard-focus states, aria-labels, and skip links where appropriate.  
• Automatize layout tests across screen sizes and device orientations before release.

---

## 2. Component Architecture

• Keep components small and distinct: TicketCard, ClientProfilePanel, ManagerDashboard, etc.  
• Store layout components (e.g., PageLayout, NavigationSidebar) separately from data-display components.  


---

## 3. Interaction & Animations

• Subtle hover states: highlight buttons, cards, or icons with a slight neumorphic lift.  
• Use minimal transitions (0.2s–0.3s) for focus states, modals, or dropdown expansions.  
• Keep skeleton-loading or progress spinners for data fetches quick and uncluttered.  
• Animate form feedback (validations, errors) with gentle movement or color shifts.

---

## 4. Navigation & Role-Specific Flows

• Agents see a "Ticket Dashboard" by default; Managers see additional "Manager Tools" tabs.  
• Clients see a "My Tickets" section with restricted data.  
• Provide direct links to relevant tickets (unread, nearing SLA) so users can quickly respond.

---

## 5. Ties with Backend & Services

• Integrate with the Node CRM using well-named fetch calls or React Query hooks.  
• For AI suggestions, ensure a loading spinner or partial skeleton while waiting on the Python service.  
• Validate user roles with the local role from the CRM before exposing restricted components (e.g., SLA config).

---

## 6. Error States & Feedback

• Display user-friendly messages on API failure, referencing the channel or action.  
• For Manager-only endpoints (e.g., role assignment), show an appropriate "Unauthorized" message if an Agent attempts access.  
• Keep logs minimal in production; do not expose server stack traces.

---

## 7. Testing & Q/A

• Test all flow-based user stories (login → ticket creation → resolution).  
• Include aXe or Lighthouse scans for accessibility checks.  
• Run UI snapshot tests to confirm minimal visual regressions, especially with neumorphic shadows.

---

By following these UI rules—covering responsiveness, accessibility, minimal but consistent interactions, and smooth ties to the backend—we build a clear, comfortable environment for extended daily use. 