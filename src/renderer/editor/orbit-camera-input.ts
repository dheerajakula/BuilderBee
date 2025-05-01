import * as pc from 'playcanvas';

export class OrbitCameraInput {
  private canvas: HTMLCanvasElement;
  private camera: pc.Entity;
  private app: pc.Application;

  private isRotating = false;
  private isPanning = false;
  private lastX = 0;
  private lastY = 0;
  private cameraDistance = 5;
  private cameraRotX = 0;
  private cameraRotY = 30;
  private targetPosition = new pc.Vec3(0, 0, 0);

  // Listener references for removal
  private onMouseDownBound!: (e: MouseEvent) => void;
  private onMouseUpBound!: (e: MouseEvent) => void;
  private onMouseMoveBound!: (e: MouseEvent) => void;
  private onMouseWheelBound!: (e: WheelEvent) => void;
  private onContextMenuBound!: (e: MouseEvent) => void;

  constructor(app: pc.Application, canvas: HTMLCanvasElement, camera: pc.Entity) {
    this.app = app;
    this.canvas = canvas;
    this.camera = camera;

    this.initialize();
  }

  private initialize(): void {
    // Define bound listeners
    this.onMouseDownBound = this.onMouseDown.bind(this);
    this.onMouseUpBound = this.onMouseUp.bind(this);
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onMouseWheelBound = this.onMouseWheel.bind(this);
    this.onContextMenuBound = this.onContextMenu.bind(this);

    // Attach listeners
    this.canvas.addEventListener('mousedown', this.onMouseDownBound);
    window.addEventListener('mouseup', this.onMouseUpBound);
    window.addEventListener('mousemove', this.onMouseMoveBound);
    this.canvas.addEventListener('wheel', this.onMouseWheelBound, { passive: false });
    this.canvas.addEventListener('contextmenu', this.onContextMenuBound);

    // Set initial position
    this.updateCameraPosition();
  }

  dispose(): void {
    // Remove listeners
    this.canvas.removeEventListener('mousedown', this.onMouseDownBound);
    window.removeEventListener('mouseup', this.onMouseUpBound);
    window.removeEventListener('mousemove', this.onMouseMoveBound);
    this.canvas.removeEventListener('wheel', this.onMouseWheelBound);
    this.canvas.removeEventListener('contextmenu', this.onContextMenuBound);
  }

  private updateCameraPosition(): void {
    const rad = Math.PI / 180;
    const x = this.cameraDistance * Math.sin(this.cameraRotX * rad) * Math.cos(this.cameraRotY * rad);
    const y = this.cameraDistance * Math.sin(this.cameraRotY * rad);
    const z = this.cameraDistance * Math.cos(this.cameraRotX * rad) * Math.cos(this.cameraRotY * rad);

    const cameraPosition = new pc.Vec3(
      this.targetPosition.x + x,
      this.targetPosition.y + y,
      this.targetPosition.z + z
    );

    this.camera.setPosition(cameraPosition);
    this.camera.lookAt(this.targetPosition);
  }

  private onMouseDown(e: MouseEvent): void {
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (e.button === 2) { // Right mouse button - rotate
      this.isRotating = true;
      e.preventDefault(); // Prevent context menu
    } else if (e.button === 1) { // Middle mouse button - pan
      this.isPanning = true;
      e.preventDefault(); // Prevent default middle-click behavior
    }
  }

  private onMouseUp(e: MouseEvent): void {
    if (e.button === 2) {
      this.isRotating = false;
    } else if (e.button === 1) {
      this.isPanning = false;
    }
  }

  private onMouseMove(e: MouseEvent): void {
    const deltaX = e.clientX - this.lastX;
    const deltaY = e.clientY - this.lastY;

    if (this.isRotating) {
      // Unity-like orbit rotation
      this.cameraRotX += deltaX * 0.3;
      this.cameraRotY = Math.max(-89, Math.min(89, this.cameraRotY + deltaY * 0.3));
      this.updateCameraPosition();
    } else if (this.isPanning) {
      // Unity-like panning - move in camera-relative horizontal and vertical planes
      const right = new pc.Vec3();
      const up = new pc.Vec3();
      const forward = new pc.Vec3();
      
      // Get camera orientation vectors
      this.camera.getWorldTransform().getX(right);
      this.camera.getWorldTransform().getY(up);
      this.camera.getWorldTransform().getZ(forward);
      
      // Scale movement sensitivity by distance for consistent feel
      const panSpeed = this.cameraDistance * 0.002;
      
      // Move target along right and up vectors
      // Note: In Unity, up/down panning is inverted, so we use positive deltaY
      const rightMove = right.clone().mulScalar(-deltaX * panSpeed);
      const upMove = up.clone().mulScalar(deltaY * panSpeed);
      
      this.targetPosition.add(rightMove);
      this.targetPosition.add(upMove);
      
      this.updateCameraPosition();
    }

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  private onMouseWheel(e: WheelEvent): void {
    // Unity-like zoom - faster when further out, slower when zoomed in
    const zoomSensitivity = 0.1;
    const zoomAmount = e.deltaY * 0.01 * this.cameraDistance * zoomSensitivity;
    this.cameraDistance = Math.max(0.5, this.cameraDistance + zoomAmount);
    
    this.updateCameraPosition();
    e.preventDefault();
  }

  private onContextMenu(e: MouseEvent): void {
    e.preventDefault(); // Prevent right-click menu in Unity-like controls
  }
} 