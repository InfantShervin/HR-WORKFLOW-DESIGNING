import {
  simulateWorkflow as mockSimulate,
  validateWorkflowStructure,
  getAutomations,
} from './mockApi';

class WorkflowService {
  async simulate(workflow) {
    try {
      const result = await mockSimulate(workflow);
      return result;
    } catch (error) {
      throw new Error(`Simulation failed: ${error.message}`);
    }
  }

  async validate(nodes, edges) {
    try {
      const result = await validateWorkflowStructure(nodes, edges);
      return result;
    } catch (error) {
      throw new Error(`Validation failed: ${error.message}`);
    }
  }

  async fetchAutomations() {
    try {
      return await getAutomations();
    } catch (error) {
      throw new Error(`Failed to fetch automations: ${error.message}`);
    }
  }

  exportAsJSON(workflow) {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workflow = JSON.parse(e.target.result);
          resolve(workflow);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

export const workflowService = new WorkflowService();
