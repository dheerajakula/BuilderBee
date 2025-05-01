import { Editor } from '../editor/Editor';
import { EditorComponent } from '../types';

export class FileManager implements EditorComponent {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  initialize(): void {
    // Register event listeners for file operations
    window.electronAPI.onSaveSceneComplete((event, filePath) => {
      this.editor.onSceneSaved(filePath);
    });

    window.electronAPI.onSaveSceneError((event, error) => {
      console.error('Error saving scene:', error);
      this.editor.showNotification(`Error saving scene: ${error}`, 5000);
    });
  }

  dispose(): void {
    // Clean up (no-op for now as Electron IPC doesn't have removal methods)
  }

  // Send the serialized scene to the main process for saving
  saveScene(sceneData: string): void {
    window.electronAPI.saveScene(sceneData);
  }
}