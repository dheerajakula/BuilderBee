import * as pc from 'playcanvas';

export class OrbitCameraInput {
  private canvas: HTMLCanvasElement;
  private camera: pc.Entity;
  private app: pc.Application; // Needed for Vec3 potentially? Keep if needed, or remove.

  private isDragging = false;
  private lastX = 0;
  private lastY = 0;
  private cameraDistance = 5;
  private cameraRotX = 0;
  private cameraRotY = 30;

  // Listener references for removal
  private onMouseDownBound!: (e: MouseEvent) => void;
  private onMouseUpBound!: () => void;
  private onMouseMoveBound!: (e: MouseEvent) => void;
  private onMouseWheelBound!: (e: WheelEvent) => void;

  constructor(app: pc.Application, canvas: HTMLCanvasElement, camera: pc.Entity) {
    this.app = app; // Store app if needed for utilities like Vec3
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

    // Attach listeners
    this.canvas.addEventListener('mousedown', this.onMouseDownBound);
    window.addEventListener('mouseup', this.onMouseUpBound);
    window.addEventListener('mousemove', this.onMouseMoveBound);
    this.canvas.addEventListener('wheel', this.onMouseWheelBound, { passive: false });

    // Set initial position
    this.updateCameraPosition();
  }

  dispose(): void {
    // Remove listeners
    this.canvas.removeEventListener('mousedown', this.onMouseDownBound);
    window.removeEventListener('mouseup', this.onMouseUpBound);
    window.removeEventListener('mousemove', this.onMouseMoveBound);
    this.canvas.removeEventListener('wheel', this.onMouseWheelBound);
  }

  private updateCameraPosition(): void {
    const rad = Math.PI / 180;
    const x = this.cameraDistance * Math.sin(this.cameraRotX * rad) * Math.cos(this.cameraRotY * rad);
    const y = this.cameraDistance * Math.sin(this.cameraRotY * rad);
    const z = this.cameraDistance * Math.cos(this.cameraRotX * rad) * Math.cos(this.cameraRotY * rad);

    // Use pc.Vec3 if app reference is kept, or import Vec3 directly
    this.camera.setPosition(x, y, z);
    this.camera.lookAt(pc.Vec3.ZERO); // Use Vec3 directly if imported
  }

  private onMouseDown(e: MouseEvent): void {
    this.isDragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  private onMouseUp(): void {
    this.isDragging = false;
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = e.clientX - this.lastX;
      const deltaY = e.clientY - this.lastY;

      this.cameraRotX += deltaX * 0.2;
      this.cameraRotY = Math.max(-90, Math.min(90, this.cameraRotY + deltaY * 0.2));

      this.updateCameraPosition();

      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }
  }

  private onMouseWheel(e: WheelEvent): void {
    this.cameraDistance = Math.max(1, this.cameraDistance + e.deltaY * 0.01);
    this.updateCameraPosition();
    e.preventDefault(); // Prevent page scroll
  }
} 