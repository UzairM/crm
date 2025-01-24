

**User Stories**
You are an intelligent software product owner. You have the following MVP features from @mvp_features.md

Your task:
• Produce comprehensive, detailed user stories in the standard format:
  "As a [type of user], I want to [perform action], so that [benefit or outcome]."
• For each user story, add acceptance criteria that helps define when the story is done.
• Make sure each feature from the list above is covered by at least 1-2 user stories (or more).
• Provide enough detail so that it’s clear how each story supports the corresponding MVP feature.

Now, given this list of features, please generate a set of user stories (including acceptance criteria) that capture the behaviors and needs of agents, managers, and clients in this Finance CRM.

**High Level Overview**

You are an expert software architect and developer. I will provide you a set of MVP features for a Finance CRM. Based on these features, design a software application that:

1. Outlines the system architecture, including any recommended technologies or frameworks.  
2. Includes at least a minimal recommended tech stack (language, backend, frontend, database choices, and any libraries for AI or other functionality). I want to use have two backend services One for AI features and Another on for the rest. and I want the frontend to be React Remix and backend microservices to be in either typescript or python depending on whats best.
3. Provides a clear, step-by-step blueprint for implementing these features (UI layout, API,  database design, and any key data structures).  
4. Focus on how to handle data flow and interactions for each feature.   

MVP features are in @mvp_features.md and user stories are in @User_stories.md that must be included in your solution design. Incorporate all the details and show how each feature would integrate into the overall system


-----------------------------
DELIVERABLE SPECIFICATIONS:
-----------------------------

• Provide an overall architectural overview: 
  - If you suggest a microservices approach, outline each microservice’s responsibilities.
  - If you suggest a monolithic approach, show key modules and layers.

• Show how data is stored, retrieved, and updated, especially for the client database and ticketing system.

• Demonstrate how AI features (e.g., LLM-based suggestions) are integrated, including the RAG knowledge base ingestion.

• Include considerations for security, user roles, and authentication, but keep it at a basic MVP level.


• If you have ideas for further enhancements or future expansions beyond the minimal set, list them separately (i.e., “Potential Future Enhancements”).

Please produce a thorough, step-by-step plan that shows how each feature can be created and integrated into a cohesive Finance CRM platform.
save the result in @high_level_overview.md 



**Tech Stack Best Practices**

Create a document called `tech-stack-rules.md`.
This file should cover all best-practices, limitations, and conventions for using the selected technologies @high_level_overview.md 
It should be thorough, and include important considerations and common pitfalls for each technology.

**Theme Options**

I want to learn more about common design principles, and how they might be applied to our project.
Give me a list of 15 possible themes (e.g. "minimalist", "retro", "futuristic", "glassmorphic", etc), with a description of each one.
Observe @User_stories  and @mvp_features.md and @high_level_overview.md  for context about the project to guide your recommendations



**UI and Theme**

I want my project to be modern, responsive, and animated. We need to define the visual and interaction guidelines for building components (including accessibility and design principles), as well as any tie-ins with the tech stack (consider our backend, for example).

Also, I have decided I want my themes to be Continental/Business-Class   and Sleek Tech/Fintech   . I want them mixed or matched with finance-friendly color palettes and iconography (e.g., currency symbols, graphs, and subtle references to money management) to align with your CRM’s functionality. Keep in mind user stories like quick scanning of tickets, managing SLAs, and AI-assisted responses—your chosen design should support clarity, quick navigation, and trustworthiness in a financial context.

Use  @User_stories  and @mvp_features.md and @high_level_overview.md to put together two new files, called `ui-rules.md` and `theme-rules.md`.
```


**Best Practices**

We need to define our project's folder structure, file naming conventions, and any other rules we need to follow.

We are building an AI-first codebase, which means it needs to be modular, scalable, and easy to understand. The file structure should be highly navigable, and the code should be well-organized and easy to read.
All files should have an explanation of their contents at the top, and all functions should have proper commentation of their purpose and parameters (JSDoc, TSDoc,  etc, whatever is appropriate).
To maintain readability by Cursor's AI tools, files should not exceed 250 lines.

Use @high_level_overview.md  @tech-stack-rules.md  @ui-rules.md  , an@theme-rules.md to put together a new file called `codebase-best-practices.md`. This document should also include a file tree demonstrating the proper separation of concerns given our project's expected structure.


**API Documentation**

We need to define the API that the frontend will use

Create a detailed API doc that defines all the API endpoints our app will use. make it exhaustive and really think about it. Provide a code example after each API endpoint.  

Use @mvp_features.md  , @User_stories.md   , @high_level_overview.md  , @tech-stack-rules.md , @ui-rules.md  , @theme-rules.md  , and @# Codebase Best Practices  to put together this file. Save it in api_endpoints.md


**Data Model**

We need to define the data model with all the fields that the app will use. 

Create a detailed data model doc that defines all the fields  our app and api will require w. make it exhaustive and really think about it. 

Use @api_endpoints.md  @mvp_features.md  , @User_stories.md   , @high_level_overview.md  , @tech-stack-rules.md , @ui-rules.md  , @theme-rules.md  , and @# Codebase Best Practices  to put together this file. Save it in data_model.md











**Implementation Plan**


We need to define the different tasks and features we'll need to complete in order to build our project.

Create a phased approach to building the application, and define the different tasks and features we'll need to complete in order to complete our goal.

Rules to follow:
- Each phase should have its own document
- Each phase should be specific to a feature, or a group of closely-related features
- Each feature should have a checklist of actionable steps, clearly specifying which steps are frontend and which are backend (frontend first, backend second)
- Some tasks will be more complex than others, and will require more steps to complete. Don't be afraid to break down a task into multiple steps-- the checklist can be as long as you want.
- Create as many phases as you deem appropriate, as long as they are specific.

Use @mvp_features.md  , @User_stories.md   , @high_level_overview.md  , @tech-stack-rules.md , @ui-rules.md  , @theme-rules.md  , and @codebase-best-practices.md  to put together each of these new files.


**llm transformation**
@phase_1_setup.md @phase_3_basic_ticketing_and_agent_ui.md @phase_2_user_and_role_management.md @phase_4_client_database_and_segmentation.md @phase_5_ai_suggested_responses.md @phase_6_multi_channel_and_bulk_email.md @phase_7_manager_sla_and_dashboard.md @phase-0-setup.md @phase_8_client_portal.md . For each of these files,for each one, flatten its lists into a single list of actionable steps than can be fed into cursor llm using sonnet 3.5 model. add an "llm" prefix to the file names. Format each checklist item with "[ ]" to denote empty completions status. Also, follow the bracket with either "FRONTEND: " or "BACKEND: ", based on the nature of the task.

**Agent Rules**
create a concise cursorrules file for our project. go over @theme-rules.md @ui-rules.md @codebase-best-practices.md @tech-stack-rules.md @api_endpoints.md @data_model.md and  @high_level_overview.md when making it . Also add anything that might have been missed or over looked. save them in agentrules.md

**Cursor Rules**
Combine multiple cursor rules files into one. 
 combine @1.cursorrules and @2.cursorrules to make one unified file. Also modify it to follow our stack from @high_level_overview.md 

**Start Project**
 lets start with our project. Implement @llm_phase_0_setup.md. Finish one task . then ask me if i am satisifed . if i say yes then mark it as complete in the file and move to the next one. Clearly explain everything you are about to do and then ask me to proceed..