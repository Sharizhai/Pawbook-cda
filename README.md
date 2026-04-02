<div align="center">
  <img src="./packages/client/public/logo.png" alt="Pawbook Logo" width="200"/>
  <h1>Pawbook</h1>
  <p><strong>The social network for pet lovers</strong></p>

  <p>
    <a href="https://nodejs.org">
      <img src="https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white" alt="Node.js"/>
    </a>
    <a href="https://svelte.dev">
      <img src="https://img.shields.io/badge/Svelte-5-ff3e00?logo=svelte&logoColor=white" alt="Svelte"/>
    </a>
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white" alt="TypeScript"/>
    </a>
    <a href="https://www.postgresql.org">
      <img src="https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue" alt="License"/>
    </a>
  </p>
</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [Security](#security)
- [License](#license)
- [Acknowledgements](#acknowledgements)


---

## About

**Pawbook** is a modern social network designed for pet owners to connect, share, and celebrate their furry, feathered, or scaly friends. Create profiles for your pets, share adorable moments, interact with other pet lovers, and build a community around your passion for animals.

- **Pet-First Design**: Each pet gets their own profile with photos, personality traits, and stories
- **Global Community**: Connect with pet owners worldwide through our multilingual platform (5 languages supported)
- **Privacy-Focused**: Your data is secure with modern authentication and encryption
- **Responsive**: Beautiful experience on desktop, tablet, and mobile devices

---

## Features

### User Management
- **Secure Authentication**: JWT-based authentication with Argon2 password hashing
- **User Profiles**: Customizable profiles with bio, profile picture, and preferences
- **Internationalization**: Available in English, French, Spanish, German, and Italian

### Pet Profiles
- **Create Pet Profiles**: Add your pets with photos, name, breed, age, and personality description

### Social Features
- **Posts & Stories**: Share text and photo posts about your pets
- **Follow System**: Follow other pet owners and stay updated with their content

### Moderation
- **Content Reporting**: Report inappropriate content
- **Admin Dashboard**: Moderation interface for administrators to review reports

### Upcoming Features
- **Photo Gallery**: Upload and showcase your pet's best moments
- **Pet Interactions**: Other users can like and comment on your pets
- **Chat**
- **Comments**: Engage with the community through comments
- **Likes**: Show appreciation for posts and pet profiles
- **Activity Feed**: Personalized feed based on who you follow
- **Automated Moderation**: Posts with multiple reports are automatically flagged for review
- **Search**
- **Notifications**
- **Dark Mode**

---

## Tech Stack

### Frontend
- **[Svelte 5](https://svelte.dev/)** - Reactive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[ParaglideJS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)** - i18n internationalization
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Vitest](https://vitest.dev/)** - Unit testing framework

### Backend
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express](https://expressjs.com/)** - Web application framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Prisma](https://www.prisma.io/)** - Modern ORM for PostgreSQL
- **[Zod](https://zod.dev/)** - Schema validation and sanitization
- **[Argon2](https://github.com/ranisalt/node-argon2)** - Password hashing (OWASP recommended)
- **[JWT](https://jwt.io/)** - Secure token-based authentication
- **[Awilix](https://github.com/jeffijoe/awilix)** - Dependency injection container

### Databases
- **[PostgreSQL](https://www.postgresql.org/)** (via [Supabase](https://supabase.com/)) - Relational data

### DevOps & Tools
- **[Docker](https://www.docker.com/)** & **Docker Compose** - Containerization
- **[CircleCI](https://circleci.com/)** - Continuous integration and deployment
- **[Cloudinary](https://cloudinary.com/)** - Image storage and optimization
- **[PNPM](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Dependabot](https://github.com/dependabot)** - Automated dependency updates and security alerts

---

## Architecture

Pawbook follows **Domain-Driven Design (DDD)** principles with a clean, layered architecture:
```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│          (Controllers, Routes, Middlewares)             │
├─────────────────────────────────────────────────────────┤
│                    Application Layer                    │
│             (Use Cases, DTOs, Services)                 │
├─────────────────────────────────────────────────────────┤
│                      Domain Layer                       │
│            (Entities, Interfaces, Rules)                │
├─────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                   │
│         (Repositories, External Services)               │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

- **Monorepo Structure**: PNPM workspace with separate `client` and `server` packages
- **Dependency Injection**: Awilix container for loose coupling and testability
- **Repository Pattern**: Abstraction layer over data access with multiple implementations (PostgreSQL, InMemory for tests)
- **Type Safety**: End-to-end TypeScript with Zod runtime validation
- **Testability**

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **[Node.js](https://nodejs.org/)** >= 18.x
- **[PNPM](https://pnpm.io/)** >= 8.x
- **[Docker](https://www.docker.com/)** (optional, for containerized deployment)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/Sharizhai/PawbookV2.git
   cd PawbookV2
```

2. **Install dependencies**
```bash
   pnpm install
```

3. **Configure environment variables**

   Create a `.env` file in `packages/server/`:
```env
PORT=3001
HOST='0.0.0.0'
NODE_ENV=development

# Token & refrsh
JWT_SECRET=yourJwtSecret
JWT_EXPIRATION_SECRET=30m
REFRESH_TOKEN_SECRET=yourRefreshTokenSecret
REFRESH_TOKEN_EXPIRATION_SECRET=2d

FRONTEND_URL=http://localhost:5173
ORIGIN=http://localhost:5173

## Database selection
USE_POSTGRES=true

## Databases
MONGO_URI=yourMongoUri
DATABASE_URL=yourDatabaseUrl

# cloudinary
CLOUDINARY_URL=yourCloudinaryUrl
CLOUDINARY_CLOUD_NAME=yourCloudinaryCloudName
CLOUDINARY_API_KEY=yourCloudinaryApiKey
CLOUDINARY_API_SECRET=yourCloudinaryApiSecret
```

4. **Set up the database**
```bash
   cd packages/server
   npx prisma migrate dev
   npx prisma generate
```

5. **Start the development server**

   From the project root:
```bash
   pnpm run dev
```

This will start:
- 🎨 Frontend: http://localhost:5173
- ⚙️ Backend API: http://localhost:3001

---

## Docker Deployment

For a simplified setup with all services containerized:
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- Frontend (Svelte app)
- Backend (Node.js API)
- PostgreSQL database
- MongoDB database

---

## Security

Security is a top priority in Pawbook. Here's what we implement:

- ✅ **Authentication**: JWT tokens with secure, httpOnly cookies
- ✅ **Password Hashing**: Argon2 (OWASP recommended, GPU-resistant)
- ✅ **Input Validation**: Zod schemas with type-safe validation
- ✅ **XSS Protection**: Custom sanitization function for all user-generated content
- ✅ **SQL Injection Prevention**: Parameterized queries via Prisma ORM
- ✅ **CORS Configuration**: Restricted origins for API access
- ✅ **Secrets Management**: Environment variables, never committed to Git
- ✅ **Dependency Scanning**: Automated Dependabot security alerts

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---


## Acknowledgements

- **Open Source Community**: For the amazing tools and libraries
- **Pet Owners**: Who inspired this project with their love for animals
- **Contributors**: Everyone who helps make Pawbook better

### Special Thanks To

- [Svelte](https://svelte.dev/) for the elegant reactive framework
- [Prisma](https://www.prisma.io/) for the fantastic ORM
- [Supabase](https://supabase.com/) for PostgreSQL hosting
- [Cloudinary](https://cloudinary.com/) for image management
- [Damir Tuarshe](https://tuarshe.com/) for his amazing and sweet Solar Icons set

---

<div align="center">
  <p>Made with ❤️ for pet lovers everywhere 🐾</p>
  <p>
    <a href="https://github.com/Sharizhai/PawbookV2/issues">Report Bug</a> •
    <a href="https://github.com/Sharizhai/PawbookV2/issues">Request Feature</a>
  </p>
</div>