# PNU-Pathfinder

> An AI-powered academic information assistant for Pusan National University students, built on RAG (Retrieval-Augmented Generation) technology.

## Problem Statement

Academic information at PNU is fragmented across departmental websites, portals, and bulletin boards. Students struggle to find accurate, up-to-date answers about courses, scholarships, deadlines, and administrative procedures.

**PNU-Pathfinder** solves this with two layers:

- deterministic academic planning APIs for student records, curriculum data, graduation requirements, and course recommendations
- a planned RAG layer that retrieves institutional documents and serves source-cited conversational answers

---

## Key Features

| Feature | Description |
|---|---|
| Student Auth | JWT-based signup, login, and current-user lookup |
| Admin Curriculum Management | Admin CRUD for academic programs, curriculum courses, and graduation requirements |
| Course Records | Student course history create/list/delete APIs |
| Graduation Progress | Calculates earned, remaining, and progress percent by requirement category |
| Course Recommendations | Suggests next courses and retake candidates from the student's progress |
| RAG-based Q&A | Planned retrieval and grounded answer generation over institutional documents |
| Source Citations | Planned links back to source documents |

---

## Repository Structure

```
PNU-Pathfinder/
├── README.md                  ← You are here
├── Tech-Stack.md              ← Canonical technology & version matrix
├── CONTRIBUTING.md            ← Git workflow, branch strategy, code standards
├── CODEX.md                   ← Codex agent working guidelines
├── CLAUDE.md                  ← Claude agent working guidelines
├── PROGRESS.md                ← Current project status and stage checklist
├── .gitignore
│
├── docs/
│   ├── Project-Planning.md    ← Goals, milestones, team roles
│   ├── System-Architecture.md ← High-level design, data flow, deployment
│   └── Presentation-Materials.md ← Slide outline & script template
│
├── backend/
│   ├── README.md              ← Backend design notes and implementation checklist
│   ├── API-Specs.md           ← REST endpoint contracts
│   └── Backend-Tech.md        ← Server stack, libraries, conventions
│
└── frontend/
    ├── UI-UX-Specs.md         ← Screens, components, design tokens
    └── Frontend-Tech.md       ← Client stack, tooling, conventions
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/blackest21/PNU-Pathfinder.git
cd PNU-Pathfinder

# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

Interactive API docs are available at `http://localhost:8000/docs` while the backend server is running.

---

## Team

| Name | Role | Responsibilities |
|---|---|---|
| TBD | PM / Architect | Repository structure, documentation, integration |
| TBD | Backend Engineer | FastAPI server, RAG pipeline, vector DB |
| TBD | Frontend Engineer | React + Vite UI, component library |
| TBD | ML / Data Engineer | Embedding models, document ingestion |

---

## License

TBD — to be defined before public release.
