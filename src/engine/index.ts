import { Editor } from './editor/Editor';
import React from 'react';
import ReactDOM from 'react-dom/client';
import HierarchyWindow from './components/HierarchyWindow';

// Create React root and render components
const setupReactUI = () => {
  const reactRoot = document.getElementById('react-ui-root');
  if (reactRoot) {
    const root = ReactDOM.createRoot(reactRoot);
    root.render(React.createElement(HierarchyWindow));
  }
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Create the editor instance
  const editor = new Editor();
  
  // Store editor instance in window for debugging
  (window as any).editor = editor;

  // Setup React UI components
  setupReactUI();
});