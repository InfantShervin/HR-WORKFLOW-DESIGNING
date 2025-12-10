# HR Workflow Designer — React + Vite

This project implements a complete **HR Workflow Designer** with a drag-and-drop interface, node-based workflow construction, validation, simulation, and workflow export/import features. It is built using **React**, **Vite**, **React Flow**, **Zustand**, and **TailwindCSS**.

The project follows a **modular architecture** that cleanly separates UI components, workflow state, validation logic, and simulation functionality.

---

## ✨ Features

- Visual workflow builder using **React Flow**
- Drag-and-drop node placement
- Five workflow node types: **Start, Task, Approval, Automated, End**
- Dynamic forms for node configuration
- Real-time validation:
  - Cycle detection  
  - Unreachable nodes  
  - Start/End rules  
- Workflow simulation with step-by-step execution logs
- Save / Load workflows locally
- Export as **JSON** and **CSV**
- Global workflow/state management using **Zustand**
- Modern UI powered by **TailwindCSS**

---

## 🏗 Architecture

The system is structured around **three major layers**:

### **1. React UI Components**
- Node palette  
- Forms panel  
- Header & layout  
- Workflow sandbox  

### **2. React Flow Canvas**
- Renders workflow nodes and edges  
- Supports dragging, selecting, connecting  
- Custom node components for each workflow step type  

### **3. Zustand Workflow Store**
- Stores:
  - Nodes  
  - Edges  
  - Saved workflows  
  - UI state (selection, modals, active panels)  
  - Simulation state  
- Acts as the **single source of truth** for all workflow data

```
React UI  ↔  Zustand Workflow Store  ↔  React Flow Engine
                    ↘ Validation + Simulation ↙
```

All workflow changes flow through the Zustand store, ensuring correct synchronization between the canvas, forms, and simulation.

---

## ▶️ How to Run

### **1. Clone the project**
```
git clone https://github.com/InfantShervin/HR-WORKFLOW-DESIGNER.git
cd hr-workflow-designer
```

### **2. Install dependencies**
```
npm install
```

### **3. Start the development server**
```
npm run dev
```

### **4. Open the application**
Visit:  
http://localhost:5173

---

## 🧠 Design Decisions

### **React Flow for Canvas Rendering**
Selected because it offers:
- Efficient graph rendering  
- Custom node support  
- Built-in edge/handle management  
- Viewport capabilities (zoom, pan)

### **Zustand Instead of Redux**
Zustand was chosen because it is:
- Lightweight  
- Fast  
- Minimal in boilerplate  
- Ideal for storing complex object structures like workflow graphs  

### **Modular Node Architecture**
Each node type consists of:
- A rendering component  
- A configuration form  
- Validation logic  

This makes the system easy to scale with new workflow node types.

### **Centralized Validation**
Validation logic is stored in `utils/validation.js`, making it:
- Reusable across save, simulate, and load  
- Clear and easy to maintain  
- Cleanly separated from UI logic  

### **Mock API for Simulation**
A frontend-only simulation layer was used to:
- Avoid backend complexity in early development  
- Provide a self-contained workflow runner  
- Allow rapid testing and iteration  

---

## ✔️ What Was Completed

- Full workflow canvas with drag-and-drop support  
- All five workflow node types implemented  
- Forms for editing node data  
- Real-time workflow validation  
- Step-by-step simulation engine  
- Workflow saving and loading  
- Export to JSON and CSV  
- Zustand-based global state management  
- TailwindCSS-based UI styling  
- Clean folder structure following best practices  

---

## ⏳ What Could Be Added With More Time

- Conditional branching logic  
- Multi-level approval workflows  
- Backend integration for persistent workflows  
- Authentication and role-based permissions  
- BPMN or XML export options  
- Undo/redo functionality  
- Real-time collaborative editing (multi-user mode)

---

## 📄 Tools and Libraries Used

- **React** — UI components  
- **React Flow** — Workflow canvas engine  
- **Zustand** — Global workflow state  
- **TailwindCSS** — Styling  
- **Vite** — Build tool and dev server  
- **ESLint** — Code quality and linting  

---

## 📌 License

This project is for **educational and prototype purposes only**.
