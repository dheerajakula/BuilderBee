import * as pc from 'playcanvas';
import { Editor } from './Editor';
import { EditorComponent, EditorEntity, SceneData } from '../types';
import { Vec3 } from 'playcanvas';
import { OrbitCameraInput } from './orbit-camera-input';
import { createGridEntity } from './grid-factory';

export class SceneView implements EditorComponent {
  private editor: Editor;
  private app!: pc.Application;
  private canvas: HTMLCanvasElement;
  private camera!: pc.Entity;
  private root!: pc.Entity;
  private cubeCount: number = 0;
  private orbitCameraInput!: OrbitCameraInput;
  private onResizeCanvas!: () => void;

  constructor(editor: Editor) {
    this.editor = editor;
    this.canvas = document.getElementById('scene-canvas') as HTMLCanvasElement;
  }

  initialize(): void {
    this.app = new pc.Application(this.canvas);

    this.onResizeCanvas = () => this.app.resizeCanvas();
    window.addEventListener('resize', this.onResizeCanvas);

    this.setupSceneCore();

    this.app.start();
  }

  dispose(): void {
    window.removeEventListener('resize', this.onResizeCanvas);
    if (this.orbitCameraInput) {
      this.orbitCameraInput.dispose();
    }
    
    this.app.destroy();
  }

  setupSceneCore(): void {
    this.root = new pc.Entity('Root');
    this.app.root.addChild(this.root);

    this.camera = new pc.Entity('Camera');
    this.camera.addComponent('camera', {
      clearColor: new pc.Color(0.4, 0.45, 0.5)
    });
    this.camera.setPosition(0, 2, 5);
    this.camera.lookAt(0, 0, 0);
    this.app.root.addChild(this.camera);

    this.orbitCameraInput = new OrbitCameraInput(this.app, this.canvas, this.camera);

    const light = new pc.Entity('Directional Light');
    light.addComponent('light', {
      type: 'directional',
      color: new pc.Color(1, 1, 1),
      castShadows: true,
      intensity: 1.5,
      shadowBias: 0.05,
      shadowDistance: 30,
      normalOffsetBias: 0.05
    });
    light.setLocalEulerAngles(45, 30, 0);
    this.app.root.addChild(light);

    createGridEntity(this.app, { color: new pc.Color(0.1, 0.1, 0.1) });
  }

  addCube(): pc.Entity {
    this.cubeCount++;
    const name = `Cube_${this.cubeCount}`;
    
    const cube = new pc.Entity(name);
    
    const material = new pc.StandardMaterial();
    material.diffuse = new pc.Color(0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);
    material.update();
    
    cube.addComponent('render', {
      type: 'box',
      material: material
    });
    
    cube.setPosition(
      (Math.random() - 0.5) * 4,
      0.5,
      (Math.random() - 0.5) * 4
    );
    
    this.root.addChild(cube);
    return cube;
  }

  resetScene(): void {
    while (this.root.children.length > 0) {
      const child = this.root.children[0];
      const gridEntity = this.app.root.findByName('Grid');
      if (child !== this.camera && child !== gridEntity) { 
         child.destroy(); 
      } else {
         this.root.removeChild(child); 
      }
    }
    this.cubeCount = 0;
  }

  serializeScene(): string {
    const sceneData: SceneData = {
      entities: [],
      version: '0.1.0'
    };

    const serializeEntity = (entity: pc.Entity): EditorEntity | null => {
      const gridEntity = this.app.root.findByName('Grid');
      if (entity === this.camera || entity.name === 'Directional Light' || entity === gridEntity) { 
        return null;
      }
      
      const position = entity.getPosition();
      const rotation = entity.getEulerAngles();
      const scale = entity.getLocalScale();

      const data: EditorEntity = {
        id: entity.getGuid(),
        name: entity.name,
        type: entity.name.toLowerCase().includes('cube') ? 'cube' : 'other',
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z],
        scale: [scale.x, scale.y, scale.z],
        components: {}
      };

      const renderComponent = entity.render;
      if (renderComponent && renderComponent.material instanceof pc.StandardMaterial) {
        const standardMaterial = renderComponent.material as pc.StandardMaterial;
        data.components = {
          render: {
            type: renderComponent.type,
            material: {
              diffuse: standardMaterial.diffuse ? [
                standardMaterial.diffuse.r,
                standardMaterial.diffuse.g,
                standardMaterial.diffuse.b
              ] : [1, 1, 1]
            }
          }
        };
      } else if (renderComponent) {
         data.components = {
             render: { type: renderComponent.type }
         };
      }

      return data;
    };

    this.root.children.forEach(entity => {
      const serialized = serializeEntity(entity as pc.Entity);
      if (serialized) {
          sceneData.entities.push(serialized);
      }
    });

    return JSON.stringify(sceneData, null, 2);
  }

  loadScene(sceneData: SceneData): void {
    this.resetScene();
    createGridEntity(this.app, { color: new pc.Color(0.7, 0.7, 0.7) });

    sceneData.entities.forEach(entityData => {
      if (entityData.type === 'cube') { 
        const cube = new pc.Entity(entityData.name);
        cube.setGuid(entityData.id);

        const renderData = entityData.components?.render;
        if (renderData) {
            const material = new pc.StandardMaterial();
            if (renderData.material?.diffuse) {
              const [r, g, b] = renderData.material.diffuse;
              material.diffuse = new pc.Color(r, g, b);
            } else {
              material.diffuse = new pc.Color(1, 1, 1);
            }
            material.update();
            
            cube.addComponent('render', {
              type: 'box',
              material: material
            });
        }
        
        cube.setPosition(entityData.position[0], entityData.position[1], entityData.position[2]);
        cube.setEulerAngles(entityData.rotation[0], entityData.rotation[1], entityData.rotation[2]);
        cube.setLocalScale(entityData.scale[0], entityData.scale[1], entityData.scale[2]);

        this.root.addChild(cube);

        const match = entityData.name.match(/Cube_(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          this.cubeCount = Math.max(this.cubeCount, num);
        }
      } else {
        console.warn(`Skipping load for unhandled entity type: ${entityData.type}`);
      }
    });
  }
}