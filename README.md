# Finance CRM

A modern CRM system built with React, Node.js, and Python, featuring AI-powered customer service capabilities.

## Project Structure

```
finance-crm/
├── app/                    # Frontend React application
├── services/              # Backend services
│   ├── core-crm/         # Core CRM service (Node.js/Express)
│   └── ai-service/       # AI service (Python/FastAPI)
├── documentation/         # Project documentation
└── .gitignore            # Git ignore rules
```

## Technology Stack

### Frontend (/app)
- React for UI components
- TypeScript for type safety
- TailwindCSS for styling
- Shadcn UI components

### Core CRM Service (/services/core-crm)
- Node.js with Express
- TypeScript
- PostgreSQL for data storage
- ORY for authentication

### AI Service (/services/ai-service)
- Python with FastAPI
- Machine Learning models for customer service
- Vector database for semantic search

## Setup Requirements

- Node.js v16+
- Python 3.9+
- Docker & Docker Compose (optional)
- npm or Yarn package manager
- Git

## Getting Started

1. Clone the repository
2. Set up environment variables (copy .env.example to .env)
3. Install dependencies for each service
4. Start the development servers

Detailed setup instructions for each service can be found in their respective directories.

## Development

Each service can be run independently in development mode:

```bash
# Frontend (React)
cd app
npm run dev

# Core CRM Service
cd services/core-crm
npm run dev

# AI Service
cd services/ai-service
uvicorn main:app --reload
```

## Contributing

Please follow our coding standards and submit PRs for review.

## License

[License details here] 