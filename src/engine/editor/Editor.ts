import * as pc from 'playcanvas';
import { SceneView } from './SceneView';
import { MenuManager } from '../services/MenuManager';
import { FileManager } from '../services/FileManager';
import { EditorEntity, SceneData } from '../types';

export class Editor {
  private sceneView: SceneView;
  private menuManager: MenuManager;
  private fileManager: FileManager;
  private statusBar: HTMLElement;
  private notification: HTMLElement;
  private notificationTimeout: number | null = null;

  constructor() {
    this.statusBar = document.getElementById('status-bar') as HTMLElement;
    this.notification = document.getElementById('notification') as HTMLElement;
    
    this.sceneView = new SceneView(this);
    this.menuManager = new MenuManager(this);
    this.fileManager = new FileManager(this);
    
    this.initialize();
  }

  initialize(): void {
    this.sceneView.initialize();
    this.menuManager.initialize();
    this.fileManager.initialize();
    
    this.setStatus('Editor initialized');
  }

  setStatus(message: string): void {
    if (this.statusBar) {
      this.statusBar.textContent = message;
    }
  }

  showNotification(message: string, duration = 3000): void {
    if (this.notification) {
      this.notification.textContent = message;
      this.notification.classList.add('show');
      
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }
      
      this.notificationTimeout = window.setTimeout(() => {
        this.notification.classList.remove('show');
        this.notificationTimeout = null;
      }, duration);
    }
  }

  // Scene management methods
  newScene(): void {
    this.sceneView.resetScene();
    this.setStatus('New scene created');
    this.showNotification('New scene created');
  }

  addCube(): void {
    const entity = this.sceneView.addCube();
    this.setStatus(`Added cube: ${entity.name}`);
    this.showNotification(`Added cube: ${entity.name}`);
  }

  loadScene(sceneData: string): void {
    try {
      const data = JSON.parse(sceneData) as SceneData;
      this.sceneView.loadScene(data);
      this.setStatus('Scene loaded');
      this.showNotification('Scene loaded successfully');
    } catch (error) {
      this.setStatus('Error loading scene');
      this.showNotification('Error loading scene: ' + String(error));
      console.error('Error loading scene:', error);
    }
  }

  saveScene(): void {
    try {
      const sceneData = this.sceneView.serializeScene();
      this.fileManager.saveScene(sceneData);
    } catch (error) {
      this.setStatus('Error saving scene');
      this.showNotification('Error saving scene: ' + String(error));
      console.error('Error saving scene:', error);
    }
  }

  onSceneSaved(filePath: string): void {
    this.setStatus(`Scene saved to ${filePath}`);
    this.showNotification(`Scene saved to ${filePath}`);
  }

  // Helper methods for accessing components
  getSceneView(): SceneView {
    return this.sceneView;
  }
}