<div align="center">

# 🚀 KnowForge AI
### AI-Powered Industrial Knowledge Loss Prevention System

<p>
Preserving industrial expertise through AI-powered knowledge management.
</p>

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4)
![License](https://img.shields.io/badge/Status-Hackathon_Project-blue)

</div>

---

# 📖 Overview

KnowForge AI is an AI-powered Industrial Knowledge Loss Prevention System designed to preserve valuable industrial expertise before it is lost due to employee retirement, resignation, or workforce transition.

The platform enables domain experts to upload industrial knowledge resources such as SOPs, troubleshooting manuals, maintenance guides, and safety procedures. AI automatically processes these documents into structured, searchable knowledge, allowing employees to retrieve accurate information through an intelligent chatbot.

---

# 🎯 Problem Statement

Industrial organizations often face significant knowledge loss when experienced employees leave the company.

This leads to:

- Loss of critical technical expertise
- Increased machine downtime
- Longer employee training periods
- Repeated operational mistakes
- Heavy dependency on senior engineers

---

# 💡 Proposed Solution

KnowForge AI creates a centralized knowledge repository where:

- Experts upload industrial documents.
- AI automatically extracts structured knowledge.
- Employees search information using natural language.
- AI answers only from approved company resources.
- Organizational knowledge is preserved for future employees.

---

# ✨ Features

## 🔐 Authentication

- Secure Login
- User Registration
- Role-Based Access
  - Employee
  - Expert
  - Manager

---

## 📄 Knowledge Upload

Experts can upload:

- PDF Manuals
- SOP Documents
- Troubleshooting Guides
- Maintenance Manuals
- Safety Procedures

---

## 🤖 AI Knowledge Processing

After document upload, AI automatically generates:

- Document Summary
- Keywords
- Standard Operating Procedure (SOP)
- Repair Steps
- Safety Checklist
- Required Tools
- Estimated Repair Time

---

## 📚 Knowledge Library

- Search Knowledge
- View AI Summary
- View SOP
- Download Documents
- Favorite Resources

---

## 💬 AI Chat Assistant

Employees can ask:

- Explain CNC Machine Error E102
- Repair steps for CNC Machine
- Safety checklist for Fire Emergency
- Required tools
- SOP for Telephone Etiquette

The chatbot responds only from approved company knowledge resources.

---

## 🔍 Smart Search

Supports searching by:

- Title
- Machine Name
- Department
- Category
- Keywords
- Summary
- SOP
- Repair Steps
- Safety Checklist
- Required Tools

---

# 🏗 Technical Architecture

```
                 React Frontend
                        │
                        ▼
                Node.js Backend
          ┌─────────────┴─────────────┐
          ▼                           ▼
     Supabase Database          Google Gemini AI
       + Storage                 AI Processing
```

---

# 🔄 System Workflow

```
Expert Login
      │
      ▼
Upload Knowledge Resource
      │
      ▼
PDF Extraction
      │
      ▼
AI Processing
      │
      ▼
Store Structured Knowledge
      │
      ▼
Knowledge Library
      │
      ▼
Employee AI Chat
```

---

# 🛠 Technology Stack

## Frontend

- React.js
- Vite
- CSS3

## Backend

- Node.js
- Express.js

## Database

- Supabase PostgreSQL

## Storage

- Supabase Storage

## Artificial Intelligence

- Google Gemini API

## PDF Processing

- pdf-parse

---

# 📂 Project Structure

```
KnowForgeAI
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── app.js
│   └── package.json
│
├── README.md
└── .env.example
```

---

# 🗄 Database Schema

Main Table:

```
knowledge
```

Key Fields:

- title
- machine_name
- department
- category
- description
- uploaded_by
- extracted_text
- summary
- keywords
- sop
- repair_steps
- safety_checklist
- required_tools
- estimated_time
- status

---

# 👥 User Roles

## 👨‍🔧 Expert

- Upload Knowledge Resources
- Maintain Technical Documents
- Share Industrial Expertise

---

## 👷 Employee

- Search Knowledge
- Ask AI Questions
- View SOPs
- Access Troubleshooting Guides

---

## 👨‍💼 Manager

- Monitor Knowledge Repository
- Review Resources
- Manage Organizational Knowledge

---

# 🚀 Future Enhancements

- Voice-Based Knowledge Capture
- Speech-to-Text Integration
- Knowledge Risk Prediction
- OCR Support
- Video Transcript Extraction
- Semantic Search
- Vector Database Integration
- Offline AI Support
- Analytics Dashboard

---

# 🎯 Industrial Applications

- Manufacturing
- Automotive
- Aerospace
- Oil & Gas
- Power Generation
- Heavy Industries
- Healthcare

---

# 👨‍💻 Team

**KnowForge AI Development Team**

Hackathon Prototype

---

# 📜 License

This project is developed for educational and hackathon purposes.

---

# ⭐ Project Highlights

- AI-Powered Knowledge Management
- Industrial Knowledge Preservation
- AI Document Processing
- Intelligent Search
- AI Chat Assistant
- Company Resource-Based Answers
- Secure Cloud Storage
- Modern React Dashboard

---

<div align="center">

### ⭐ If you like this project, consider giving it a star!

**Built with ❤️ using React, Node.js, Supabase & Google Gemini AI**

</div>
