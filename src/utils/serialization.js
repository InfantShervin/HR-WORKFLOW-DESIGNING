export const serializeWorkflow = (nodes, edges) => {
  return {
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    })),
  };
};

export const exportWorkflowAsJSON = (workflow, filename = 'workflow.json') => {
  const dataStr = JSON.stringify(workflow, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const importWorkflowFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workflow = JSON.parse(event.target.result);
        resolve(workflow);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const downloadWorkflowAsCSV = (workflow) => {
  let csv = 'Node ID,Node Type,Title,Details\n';

  workflow.nodes.forEach(node => {
    const title = node.data.title || '';
    const details = JSON.stringify(node.data).replace(/"/g, '""');
    csv += `"${node.id}","${node.type}","${title}","${details}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `workflow-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
