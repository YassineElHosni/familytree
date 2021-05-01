import React from 'react'
import { useCanvas } from '../../hooks/useCanvas';

export default function TreeCanvas() {
    const [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight ] = useCanvas();
    const handleCanvasClick=(event)=>{
      // on each click get current mouse location 
      const currentCoord = getMousePos(canvasRef.current, { x: event.clientX, y: event.clientY });
      console.log(currentCoord)
      // add the newest mouse location to an array in state 
      setCoordinates([...coordinates, currentCoord]);
    };
    //Get Mouse Position
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        console.log(rect,evt)
        return {
            x: evt.x - rect.left,
            y: evt.y - rect.top
        };
    }
  
    const handleClearCanvas=(event)=>{
      setCoordinates([]);
    };
  
    return (
      <main className="App-main" >
        <canvas 
          className="App-canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick} />
  
        <div className="canvasButton" >
          <button onClick={handleClearCanvas} > CLEAR </button>
        </div>
      </main>
    );
}
