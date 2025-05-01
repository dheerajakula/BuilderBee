import { Editor } from '../editor/Editor';
import { EditorComponent } from '../types';

export class MenuManager implements EditorComponent {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  initialize(): void {
    // Register event listeners for menu actions
    window.electronAPI.newScene(() => {
      this.editor.newScene();
    });

    window.electronAPI.addCube(() => {
      this.editor.addCube();
    });

    window.electronAPI.loadScene((event, data) => {
      this.editor.loadScene(data);
    });

    window.electronAPI.requestSaveScene(() => {
      this.editor.saveScene();
    });
  }

  dispose(): void {
    // Clean up (no-op for now as Electron IPC doesn't have removal methods)
  }
}