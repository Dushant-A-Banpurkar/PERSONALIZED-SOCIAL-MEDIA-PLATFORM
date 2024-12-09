import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<CanvasDraw>(null);
  const [drawingData, setDrawingData] = useState<string>("");

  // Load drawing data when the component mounts
  useEffect(() => {
    const fetchDrawingData = async () => {
      try {
        const response = await fetch("/get-drawing"); // Adjust URL as needed
        if (response.ok) {
          const data = await response.json();
          setDrawingData(data.drawing); // Assuming response contains { drawing: <drawingData> }
          canvasRef.current?.loadSaveData(data.drawing);
        }
      } catch (error) {
        console.error("Error fetching drawing data:", error);
      }
    };

    fetchDrawingData();
  }, []);

  // Save drawing data to backend
  const saveDrawing = async () => {
    const saveData = canvasRef.current?.getSaveData(); // Get serialized drawing data
    if (saveData) {
      try {
        const response = await fetch("/save-drawing", { // Adjust URL as needed
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ drawing: saveData }),
        });
        if (response.ok) {
          console.log("Drawing saved successfully!");
        } else {
          console.error("Error saving drawing.");
        }
      } catch (error) {
        console.error("Error saving drawing:", error);
      }
    }
  };

  // Clear the canvas
  const clearCanvas = () => {
    canvasRef.current?.clear();
  };

  // Undo the last action on the canvas
  const undoCanvas = () => {
    canvasRef.current?.undo();
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <CanvasDraw
        ref={canvasRef}
        brushColor="black"
        brushRadius={2}
        canvasWidth={500}
        canvasHeight={400}
        lazyRadius={0}
        saveData={drawingData} // Use loaded drawing data to initialize the canvas
      />
      <div className="flex justify-between mt-4">
        <button
          onClick={clearCanvas}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Clear
        </button>
        <button
          onClick={undoCanvas}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Undo
        </button>
        <button
          onClick={saveDrawing}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
