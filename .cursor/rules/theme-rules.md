# Theme Rules & Visual Strategy

This document defines the primary look and feel (Minimalist + slight Neumorphism), referencing @User_stories.md, @high_level_overview.md, and @tech-stack-rules.md. The aim is to keep the interface pleasant for long working hours while retaining clarity.

---

## 1. Overall Style

• Base styling: Minimalist, emphasizing clean layout, logical spacing, and low-contrast backgrounds.  
• Subtle neumorphism: Soft shadows lending an embossed or recessed feel for panels and interactive elements.  
• Restraint: Avoid clutter or heavy visual flourishes; let whitespace and alignment guide the eye.

---

## 2. Color Palette

• Neutral Grays (#F8F9FA, #E9ECEF, #CED4DA) for backgrounds and panels.  
• Token highlight color (e.g., medium-gray or light-blue shadow) for neumorphic shadows.  
• Subtle accent color (e.g., #007BFF or #61A5C2) for interactive states like primary buttons or active links.

---

## 3. Typography

• Modern sans-serif (e.g., Inter, Roboto) for body text, headings, and UI labels.  
• Emphasize readable font sizes (14–16px for base text) to reduce eye strain.  
• Keep line spacing airy, especially for dense ticket text in Agents' or Clients' views.

---

## 4. Shadows & Depth

• Utilize softly diffused shadows (spread, low offset) to produce a slight layered effect.  
• Elements that users interact with (buttons, cards) can have a mild "lift" on hover/pressed state.  
• Avoid harsh drop shadows; aim for gentle shading that matches the minimal aesthetic.

---

## 5. Animation & Feedback

• Smooth transitions on hover or focus (0.2s–0.3s).  
• For critical interactions (e.g., SLA breach alerts), use color changes or a discrete vibration effect.  
• Keep subtle feedback consistent: uniform shadow expansions or color shifts across UI components.

---

## 6. Compatibility with Tech Stack

• Adhere to the CSS structure set in React + Tailwind or standard PostCSS if used.  
• Respect user roles from the Node CRM, ensuring consistent theme elements in dashboards, portals, and AI suggestion areas.  
• Light on heavy assets; reduce memory overhead for a smoother experience across devices.

---

## 7. Future Extensions

• If we move to dark mode, adapt shadow intensities for readability.  
• Evolve more pronounced neumorphism for specialized pages or agent tools.  
• Expand accent color usage if marketing or manager dashboards require vibrant highlights.

---

By blending a restraint-driven Minimalist approach with light Neumorphism, we foster a cohesive UI that is both visually appealing and comfortable for daily tasks in the Finance CRM environment. 