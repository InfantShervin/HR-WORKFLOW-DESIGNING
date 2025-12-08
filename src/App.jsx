import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <header className="border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          HR Workflow Designer
        </h1>
        <span className="text-xs text-slate-400">
          Prototype • React + React Flow
        </span>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4">
          <h2 className="text-sm font-semibold mb-3 text-slate-200">
            Node Types
          </h2>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">
              Start Node
            </div>
            <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">
              Task Node
            </div>
            <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">
              Approval Node
            </div>
            <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">
              Automated Node
            </div>
            <div className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700">
              End Node
            </div>
          </div>
        </aside>

        {/* Canvas placeholder */}
        <section className="flex-1 bg-slate-900 flex items-center justify-center">
          <div className="border border-dashed border-slate-700 rounded-xl px-10 py-6 text-center text-slate-400">
            <p className="text-sm mb-2">
              Workflow Canvas (React Flow will go here)
            </p>
            <p className="text-xs">
              Next: integrate React Flow and draggable nodes.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
