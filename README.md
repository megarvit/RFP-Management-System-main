# RFP-Management-System
An end-to-end AI-powered platform that automates the entire Request for Proposal (RFP) creation, evaluation, and lifecycle management process. This system reduces manual effort, improves accuracy, and speeds up decision-making using LLMs, ML-based scoring, and workflow automation.

## Overview
The **AI-RFP-System** consists of two major components:

- *Backend*
  - Handles authentication, RFP ingestion, AI scoring, versioning, workflows, and database management.

- *Frontend*
  - A clean UI for creating RFPs, reviewing AI-generated scores, managing proposals, and tracking status.

This project is designed to resemble real enterprise RFP automation software used in procurement, enterprise sales, and vendor management.

## Project Structure
```perl
ai-rfp-system/
  backend/
  frontend/
  README.md
```

## Features
1. **AI-based Proposal Scoring**
    - LLM-based semantic similarity scoring
    - Weighted scoring by category (tech, pricing, compliance, SLA, etc.)
    - Custom business-logic scoring models
2. **RFP Creation & Management**
    - Create structured RFPs (sections, questions, scoring)
    - Upload PDFs/Docs → Extract requirements using AI
    - Automatic version history
3. **Vendor Proposal Evaluation**
    - Upload vendor responses
    - AI auto-maps answers to RFP questions
    - Generates:
        - Scores
        - Strengths & weaknesses
        - Risk flags
        - Summary report
4. **Workflow Automation** (Future Goal)
    - Status tracking: Draft → Published → Under Review → Awarded
    - Role-based access (Admin, Reviewer, Vendor)
5. **Dashboards & Analytics** (Future Goal)
    - Proposal comparison
    - Heatmaps
    - Time taken to evaluate
    - Category-weight analytics
  

## Tech Stack
### Backend
- Node.js
- Express.js
- Nodemailer (email send)
- IMAP-Simple (email receiving)
- OpenAI API
- PostgreSQL (via pg) or MongoDB (via mongoose)

### Frontend (React)
- React + Vite
- TailwindCSS
- Axios
- Zustand / Redux

### Database
- PostgreSQL

## Project Setup
### Prerequisites
- Node.js (v18+ recommended)
- npm
- PostgreSQL
- OpenAI API Key
- Email account for SMTP + IMAP
  - (Gmail, Outlook, or any SMTP provider)

### Backend Setup
```bash
cd backend
npm install
```
Create .env:
```ini
OPENAI_KEY=your_key_here

# Database
DB_URL=your_database_url

# Email sending/receiving
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

IMAP_HOST=imap.gmail.com
IMAP_PORT=993
```
Start backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Email Configuration

To enable email sending + receiving:
- Enable “App Passwords” or “Less secure apps” (depending on provider)
- Add SMTP + IMAP credentials to your .env
- Backend uses **Nodemailer** for send
- Backend uses **IMAP** for receiving vendor replies

### Running Locally
1. Start Database
2. Start Backend
3. Start Frontend
4. Open browser at:
    ```arduino
    http://localhost:3000
    ```

## API Documentation (Starter)
1. POST /api/rfp/create
   - Create structured RFP from natural language.

  **Body**
  ```json
  { "text": "We need 20 laptops..." }
  ```
  **Response**
  ```json
  {
    "id": "123",
    "title": "Laptop & Monitor Procurement",
    "budget": 50000,
    "items": [...],
    "delivery": "30 days"
  }
  ```
2. POST /api/vendors
   - Add a vendor.
3. POST /api/rfp/:id/send
   - Send RFP email to selected vendors.
4. GET /api/email/fetch
   - Fetch vendor email replies.
5. GET /api/rfp/:id/comparison
   - AI-based vendor proposal comparison.

## Key Decisions & Assumptions

### Modeling
  - RFP stored as structured JSON (title, budget, items, terms)
  - Vendor proposals linked by *rfpId*
  - Email replies parsed with AI

### AI Usage
  - Convert natural language → structured RFP
  - Extract vendor proposal details from messy emails
  - Compare proposals and generate recommendation summary

### Assumptions
  - One user (single-tenant)
  - Emails arrive in plain text or simple attachments
  - Vendors respond with basic numbers/terms
  - No authentication required

## AI Tools Usage
During development:
  - **ChatGPT** used for:
      - Boilerplate code generation
      - Prompt design for structured output
      - Email parsing logic
      - Few debugging cases

## Core System Flow
1. **Create an RFP**
    - Add sections → Add questions → Add weights
2. **Invite Vendors**
    - Vendors get a link to submit proposal responses
    - They answer questions in structured format
3. **AI Evaluation**
    - AI compares each vendor answer to expected answer
    - Generates:
        - Score (0–100)
        - Reasoning
        - Risk level
        - Missing information
4. **Committee Review**
     - Human reviewers can override AI scores
     - Compare vendors
     - Finalize winner

## Future Improvements
  - Vendor portal login
  - Multi-user authentication
  - Versioning & approvals
  - Attachment parsing (PDF, CSV)
  - Multi-RFP dashboards







