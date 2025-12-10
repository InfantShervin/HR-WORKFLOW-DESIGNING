HR Workflow Designer — React + Vite

This project implements a complete HR Workflow Designer with a drag-and-drop interface, node-based workflow construction, validation, simulation, and workflow export/import features.
It is built using React, Vite, React Flow, Zustand, and TailwindCSS.

The project follows a modular architecture that cleanly separates UI components, workflow state, validation logic, and simulation functionality.

✨ Features

Visual workflow builder using React Flow

Drag-and-drop node placement

Five node types: Start, Task, Approval, Automated, End

Dynamic forms for node configuration

Real-time validation (cycles, unreachable nodes, Start/End rules)

Workflow simulation with step-by-step execution logs

Save / Load workflows locally

JSON and CSV export

Global workflow/state management with Zustand

TailwindCSS styling

🏗 Architecture

The system is structured around three major layers:

React UI Components

Node palette

Forms panel

Header & layout

Workflow sandbox

React Flow Canvas

Renders nodes and edges

Supports dragging, selecting, connecting

Custom node components

Zustand Workflow Store

Nodes

Edges

Saved workflows

UI state (panels, selections)

Simulation state

React UI ↔ Zustand Store ↔ React Flow Engine
       ↘ Validation + Simulation ↙


All workflow changes go through the Zustand store, making it the single source of truth.

▶️ How to Run

Clone the project:

git clone https://github.com/InfantShervin/HR-WORKFLOW-DESIGNER.git
cd hr-workflow-designer


Install dependencies:

npm install


Start the development server:

npm run dev


The application will be available at:

http://localhost:5173

🧠 Design Decisions
React Flow for Canvas Rendering

Chosen for its efficient graph rendering, custom node support, viewport control, and built-in edge management.

Zustand Instead of Redux

Lightweight, fast, minimal boilerplate, and ideal for workflow-style object storage.

Modular Node System

Each node type has:

Its own UI component

Its own configuration form

Its own validation rules

Easy to extend with future node types.

Centralized Validation

All validation logic is isolated in utils/validation.js, making it reusable and easy to maintain.

Mock API for Simulation

A frontend-only simulation engine was used to avoid backend complexity and allow full portability.

✔️ What Was Completed

Canvas with drag-and-drop nodes

Node types and configuration forms

Live validation

Step-by-step simulation engine

Workflow saving/loading

JSON and CSV export

Zustand-based state management

Full Tailwind UI

Clean folder-based architecture

⏳ What Could Be Added With More Time

Conditional branching logic

Multi-level approval workflows

Real backend integration

User authentication and role-based editing

BPMN/XML export

Undo/redo system

Real-time collaborative editing

📄 Tools and Libraries Used

React — UI Components

React Flow — Workflow canvas

Zustand — Global State

TailwindCSS — Styling

Vite — Build tool

ESLint — Code linting

📌 License

This project is for educational and prototype purposes.
