import { Editor } from './editor/Editor';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Create the editor instance
  const editor = new Editor();
  
  // Store editor instance in window for debugging
  (window as any).editor = editor;
});