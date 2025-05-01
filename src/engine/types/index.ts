// Extending the Window interface to include our API
declare global {
    interface Window {
      electronAPI: {
        newScene: (callback: () => void) => void;
        addCube: (callback: () => void) => void;
        loadScene: (callback: (event: Electron.IpcRendererEvent, data: string) => void) => void;
        requestSaveScene: (callback: () => void) => void;
        saveScene: (sceneData: string) => void;
        onSaveSceneComplete: (callback: (event: Electron.IpcRendererEvent, filePath: string) => void) => void;
        onSaveSceneError: (callback: (event: Electron.IpcRendererEvent, error: string) => void) => void;
      };
    }
  }
  
  // PlayCanvas entity with additional properties for our editor
  export interface EditorEntity {
    id: string;
    name: string;
    type: 'cube' | 'camera' | 'light' | 'other';
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    components?: any;
  }
  
  // Scene structure for saving/loading
  export interface SceneData {
    entities: EditorEntity[];
    version: string;
  }
  
  // Editor component interface
  export interface EditorComponent {
    initialize(): void;
    dispose(): void;
  }
  
  export {};