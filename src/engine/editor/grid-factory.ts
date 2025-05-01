import * as pc from 'playcanvas';
import { Vec3 } from 'playcanvas'; // Assuming Vec3 might be needed, if not, remove

/**
 * Options for creating the grid.
 */
export interface GridOptions {
  size?: number;
  divisions?: number;
  color?: pc.Color;
  name?: string;
}

/**
 * Creates a grid entity with lines generated using a Mesh.
 * @param app - The PlayCanvas application instance.
 * @param options - Optional configuration for the grid.
 * @returns The created grid entity.
 */
export function createGridEntity(app: pc.Application, options?: GridOptions): pc.Entity {
  const size = options?.size ?? 10;
  const divisions = options?.divisions ?? 10;
  const color = options?.color ?? new pc.Color(0.6, 0.6, 0.6);
  const name = options?.name ?? 'Grid';

  const step = size / divisions;
  const halfSize = size / 2;

  const positions: number[] = [];
  const indices: number[] = [];
  let index = 0;

  // Generate vertices and indices
  for (let i = -halfSize; i <= halfSize; i += step) {
    positions.push(i, 0, -halfSize);
    positions.push(i, 0, halfSize);
    indices.push(index++, index++);

    positions.push(-halfSize, 0, i);
    positions.push(halfSize, 0, i);
    indices.push(index++, index++);
  }

  // Create mesh
  const mesh = new pc.Mesh(app.graphicsDevice);
  mesh.setPositions(positions);
  mesh.setIndices(indices);
  mesh.update(pc.PRIMITIVE_LINES);

  // Create material
  const material = new pc.BasicMaterial();
  material.color = color;
  material.update();

  // Find or create entity
  let gridEntity = app.root.findByName(name) as pc.Entity;
  if (!gridEntity) {
    gridEntity = new pc.Entity(name);
    app.root.addChild(gridEntity);
  } else {
    gridEntity.removeComponent('render');
  }

  // Add render component
  gridEntity.addComponent('render', {
    type: 'asset',
    meshInstances: [new pc.MeshInstance(mesh, material)],
  });

  console.log(`Grid entity '${name}' created/updated.`);
  return gridEntity;
} 