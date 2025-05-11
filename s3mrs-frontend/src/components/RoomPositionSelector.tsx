import React from "react"; // Import React
import styles from './RoomPositionSelector.module.css'; // Import the CSS module

export interface Position {
  x: number; // Grid column index (0-2)
  y: number; // Grid row index (0-2)
  z: number; // Floor index (0-3)
}

interface Props {
  position: Position | null; // Allow null for no selection initially
  setPosition: (pos: Position) => void;
}

// --- Constants for 3D Visualization ---
const CELL_SIZE_3D = 40; // Size of the cube in 3D view (matches face size)
const FLOOR_HEIGHT_3D = 50; // Visual height difference between floors
const GRID_WIDTH = 3; // Number of cells horizontally (X)
const GRID_DEPTH = 3; // Number of cells depth-wise (Y)
const NUM_FLOORS = 4; // Number of floors (Z)

export default function RoomPositionSelector({ position, setPosition }: Props) {

  // --- Calculate 3D position for the selected cube ---
  let cubeStyle = {};
  if (position !== null) {
      // Center the 3D grid visually within the scene
      // Offset = -(dimension_size / 2) * item_size
      const offsetX = -((GRID_WIDTH -1) / 2) * CELL_SIZE_3D;
      const offsetZ_depth = -((GRID_DEPTH-1) / 2) * CELL_SIZE_3D; // Y grid maps to Z depth
      const offsetY_floor = -((NUM_FLOORS-1) / 2) * FLOOR_HEIGHT_3D; // Z floor maps to Y height

      // Map grid coordinates to 3D space axes
      const translateX = position.x * CELL_SIZE_3D + offsetX;
      const translateY_floor = position.z * FLOOR_HEIGHT_3D + offsetY_floor; // Z (floor) controls Y (height)
      const translateZ_depth = position.y * CELL_SIZE_3D + offsetZ_depth; // Y (grid row) controls Z (depth)

      cubeStyle = {
          // Adjust final position to account for centering the cube itself (- size/2)
           transform: `translate3d(calc(-50% + ${translateX}px), calc(-50% + ${translateY_floor}px), ${translateZ_depth}px)`
      };
  }

  return (
    <div className={styles.container}>
      {/* --- 2D Selector Panel --- */}
      <div className={styles.panel}>
         <h3 className={styles.selectorTitle}>Select Room Position (2D Grid)</h3>
        <p className={styles.selectedInfo}>
          Selected position:{" "}
          {position
            ? `(X: ${position.x}, Y: ${position.y}, Floor: ${position.z + 1})`
            : "None"}
        </p>

        {/* Generate Floor Grids */}
        {Array.from({ length: NUM_FLOORS }).map((_, z) => (
          <div key={z} className={styles.floor}>
            <strong className={styles.floorTitle}>Floor {z + 1}</strong>
            <div className={styles.grid}>
              {/* Generate Cells within Grid */}
              {Array.from({ length: GRID_WIDTH * GRID_DEPTH }).map((_, idx) => {
                const x = idx % GRID_WIDTH;
                const y = Math.floor(idx / GRID_WIDTH);
                const isSelected =
                  position !== null &&
                  position.x === x &&
                  position.y === y &&
                  position.z === z;

                return (
                  <div
                    key={idx}
                    onClick={() => setPosition({ x, y, z })}
                    // Apply base cell style + selected style conditionally
                    className={`${styles.cell} ${isSelected ? styles.cellSelected : ""}`}
                    title={`Pos: (${x}, ${y}), Floor: ${z + 1}`} // Tooltip
                  >
                    {/* Optional: Display coordinates in cell */}
                    {/* {x},{y} */}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* --- 3D Visualization Panel --- */}
      <div className={`${styles.panel} ${styles.viewPanel}`}>
         <h3 className={styles.selectorTitle}>Position Visualization (3D)</h3>
        <div className={styles.viewContainer}>
          <div className={styles.scene}>
            {/* Render the cube only if a position is selected */}
            {position !== null && (
                <div className={styles.selectedCube} style={cubeStyle}>
                  <div className={`${styles.cubeFace} ${styles.faceFront}`}></div>
                  <div className={`${styles.cubeFace} ${styles.faceBack}`}></div>
                  <div className={`${styles.cubeFace} ${styles.faceLeft}`}></div>
                  <div className={`${styles.cubeFace} ${styles.faceRight}`}></div>
                  <div className={`${styles.cubeFace} ${styles.faceTop}`}></div>
                  <div className={`${styles.cubeFace} ${styles.faceBottom}`}></div>
                </div>
             )}
          </div>
        </div>
         <p className={styles.selectedInfo}>
          {position ? `Visualizing: Floor ${position.z + 1}, Grid (${position.x}, ${position.y})` : "Select a position"}
         </p>
      </div>
    </div>
  );
}