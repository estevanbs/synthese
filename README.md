# Synthese: AI-Powered Knowledge Base

A personalized knowledge base app that helps users organize unstructured notes using AI. Whether you're studying, reading, watching TV, or brainstorming, Synthese helps you capture raw thoughts and transform them into organized, retrievable knowledge.

---

## 🎯 Core Features

### Raw Input
Quickly dump unstructured thoughts into the app without worrying about organization. Just type freely—no formatting required.

### AI Organization
Click the "Organize" button to let our local AI agent analyze and structure your thoughts intelligently. The AI understands context and relationships between ideas.

### Interactive Clarification
The AI proactively asks clarifying questions during the organization process. Answer these questions to help the AI better understand and structure ambiguous ideas before finalizing the content.

### Topic Organization
Organize your notes by topics. Create new topics as needed, and add related notes to existing topics. Build your knowledge base by categorizing and grouping information in a way that makes sense for your learning.

### Conversational Learning
Once organized, chat seamlessly with the AI about your stored topics. Use it to study, retrieve knowledge, explore connections, or dig deeper into what you've learned.

---

## 📋 User Flow

```
1. Write → Drop unstructured thoughts into the text area
2. Organize → Click "Organize" button
3. Clarify → Answer AI's clarifying questions  
4. Assign Topic → Choose an existing topic or create a new one
5. Learn → Chat with AI about your organized topics
```

---

## 🛠️ Tech Stack

**Frontend:**
- Angular 21
- TypeScript 5.9
- Playwright (E2E Testing)

**Backend:**
- NestJS 11
- Node.js
- TypeScript 5.9

**Development:**
- Nx 22.5.3 (Monorepo Management)
- Jest 30 (Unit Testing)
- ESLint 9 (Linting)
- Prettier 3.6 (Code Formatting)

**DevOps:**
- Docker Compose (Development environment)
- pnpm (Package Management)

---

## 📁 Project Structure

```
synthese/
├── apps/
│   ├── api/              # NestJS backend
│   ├── api-e2e/          # API end-to-end tests
│   ├── web/              # Angular frontend
│   └── web-e2e/          # Web end-to-end tests
├── libs/                 # Shared libraries
├── docker-compose.yml    # Local development environment
├── nx.json              # Nx configuration
├── package.json         # Root dependencies
└── pnpm-workspace.yaml  # pnpm workspace config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- Docker & Docker Compose (optional, for containerized development)

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Or with Docker Compose
docker-compose up
```

### Running Specific Apps

```bash
# Start the API
pnpm nx serve api

# Start the Web app
pnpm nx serve web

# Run API E2E tests
pnpm nx e2e api-e2e

# Run Web E2E tests
pnpm nx e2e web-e2e

# Run unit tests
pnpm nx test api
pnpm nx test web
```

---

## 📝 Development

### Code Quality

```bash
# Run linter
pnpm nx lint api

# Format code
pnpm nx format:write

# Type checking
pnpm nx typecheck api
```

### Building for Production

```bash
# Build all apps
pnpm nx build

# Build specific app
pnpm nx build api
pnpm nx build web
```

---

## 🔄 Key Architectural Principles

1. **Topic-Based Organization**: Users add organized notes to topics they create, building a personalized categorized knowledge base
2. **AI-Assisted Structuring**: The AI helps format raw thoughts into clear, structured notes
3. **User Control**: Users guide the AI through clarifying questions and decide how to organize their knowledge
4. **Local Processing**: AI processing prioritizes privacy by using local agents where possible

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions are welcome! ❤️