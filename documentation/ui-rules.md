# UI Rules & Guidelines

This document describes the core principles for building a modern, responsive, and animated user interface for the Finance CRM MVP. It takes into account the user stories in User_stories, the MVP features from mvp_features.md, and the system architecture outlined in high_level_overview.md.

---

## 1. Component Architecture & Code Organization

1.1 Modular Components  
• Each UI element (e.g., ticket card, client profile, role assignment form) should exist in its own folder or file for clarity and reusability.  
• Maintain separate folders for common components (buttons, form inputs, modals) versus feature-specific components (ticket lists, dashboards).

1.2 State Management & Data Flow  
• Rely on Remix's loader/action system whenever possible for server-side data fetching.  
• For more complex or shared state (e.g., user session, unread ticket counts), use a global state mechanism (React Context or an external library if needed).  

1.3 Integration with the Backend (Express, AI Service)  
• Each component that needs data from the Core CRM or AI service uses React Query/SWR hooks; these talk to the backend APIs.  
• Maintain consistent naming and data contracts. A "TicketList" component, for example, should expect an array of ticket objects with fields that match the Express API response.  

---

## 2. Responsiveness & Accessibility

2.1 Responsive Layout  
• Use a mobile-first approach to ensure the entire interface (including dashboards, multi-column layouts) scales well on phones, tablets, and desktops.  
• Follow standard breakpoints (e.g., 576px, 768px, 992px, 1200px), adjusting them as needed for your user base.

2.2 Accessibility Standards  
• All interactive elements (buttons, links) must have keyboard focus states and descriptive ARIA labels if not obvious from context.  
• Maintain high color contrast for text (WCAG AA minimum).  
• Provide alt text for icons/graphics, especially if they convey important data (e.g., graph icons, currency symbols, or alert banners).

2.3 Animations & Performance  
• Use lightweight, CSS-based animations or small React libraries (e.g., Framer Motion) for transitions.  
• Avoid overwhelming users with too many animated elements. Subtle transitions in modals or dropdowns can enhance user focus without distraction.  

---

## 3. Interaction & Navigation

3.1 Navigation Structure  
• Primary navigation includes sections relevant to user roles: Dashboard, Tickets, Clients, Manager Tools (e.g., SLA, Bulk Email), and a Client Portal if logged in as a client.  
• Use clear, consistent naming. For example, the "Manager Dashboard" should be labeled as such (versus a generic "Admin").

3.2 Quick Access & Searching  
• Provide search bars or filters in key areas—ticket lists, client database, etc.—to align with user stories where Agents need quick scanning of tickets or Managers need segmentation for marketing.  
• Allow advanced filters (region, net worth, risk category) in the client database per user story 2.2.

3.3 Error Handling & Validation  
• Show user-friendly messages when a form submission fails (e.g., invalid email, missing required fields).  
• For background job errors (e.g., AI request failures), display a notification toast or alert, so Agents and Managers can retry if needed.

---

## 4. Building for Clarity & Trustworthiness

4.1 Data-Intensive Views  
• For ticket queues, dashboards, or large data tables, ensure sorting, pagination, or infinite scrolling is available.  
• Visual cues (e.g. flags for high-priority tickets near SLA breach) should stand out clearly.

4.2 Security Privacy Indicators  
• If certain data (like PST or email ingestion) is restricted to Agents/Managers, display locked icons or restricted states for unauthorized roles.  
• Include small disclaimers or info icons for any partial or incomplete AI data to manage user expectations.

4.3 Consistency in Layout & Components  
• The same "Ticket Card" layout should appear in all contexts (agent dashboard, manager dashboards, etc.), ensuring users intuitively recognize ticket details.  
• Keep form styles and button styles consistent across the entire app.

---

## 5. Future Considerations

• Expand integration with specialized motion design if the user base welcomes more interactive experiences (e.g., advanced infographics for manager dashboards).  
• As the AI features grow (auto-generated FAQ, knowledge base expansions), consider specialized UIs for reviewing and curating AI-generated content.  

---

## Conclusion

These UI rules ensure the Finance CRM remains modern, responsive, and user-friendly. By leveraging React's structure, focusing on accessibility, and tying into the Express + AI backend consistently, the user experience will be seamless for Agents, Managers, and Clients alike—all while retaining the professionalism required in the finance sector. 