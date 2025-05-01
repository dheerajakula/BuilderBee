import React from "react";
import { useControls, folder, Leva } from "leva";

interface HierarchyWindowProps {
  // Props can be added here as needed
}

function HierarchyWindow(props: HierarchyWindowProps) {
  // Sample game object hierarchy with nested properties
  const values = useControls({
    Scene: folder({
      name: "My Scene",
      active: true,
    }),
    Cube_1: folder({
      position: {
        value: { x: 0, y: 1, z: 0 },
        step: 0.1,
      },
      rotation: {
        value: { x: 0, y: 0, z: 0 },
        step: 1,
      },
      scale: {
        value: { x: 1, y: 1, z: 1 },
        step: 0.1,
      },
      material: folder({
        color: "#ff0000",
        metalness: { value: 0.5, min: 0, max: 1 },
        roughness: { value: 0.5, min: 0, max: 1 },
      }),
      visible: true,
    }),
    Light: folder({
      type: { options: ["Point", "Directional", "Spot"] },
      intensity: { value: 1.5, min: 0, max: 10, step: 0.1 },
      color: "#ffffff",
      castShadows: true,
      position: {
        value: { x: 5, y: 10, z: 5 },
        step: 0.5,
      },
    }),
    Camera: folder({
      fov: { value: 60, min: 10, max: 120, step: 1 },
      near: { value: 0.1, min: 0.01, max: 10, step: 0.01 },
      far: { value: 1000, min: 100, max: 5000, step: 100 },
      position: {
        value: { x: 0, y: 2, z: 5 },
        step: 0.1,
      },
    }),
  });

  const styles: Record<string, React.CSSProperties> = {
    container: {
      position: "relative",
      width: "300px",
      height: "100%",
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
    },
    title: {
      padding: "8px 12px",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      fontWeight: "bold",
      backgroundColor: "#333",
      borderBottom: "1px solid #444",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Scene Hierarchy</div>
      <Leva
        fill
        flat
        titleBar={false}
        theme={{
          colors: {
            accent1: "#007BFF",
            accent2: "#0063CC",
            accent3: "#444",
          },
        }}
      />
    </div>
  );
}

export default HierarchyWindow;
