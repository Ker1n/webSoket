import React from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/toolbar.scss";

import Brush from "../tools/Brush";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import Square from "../tools/Square";

export class ToolBar extends React.Component {
  state = {
    selectedTool: '',

  };

  changeColor(e) {
    toolState.setStrokeColor(e.target.value);
    toolState.setFillColor(e.target.value);
  }

  setToolBrushHandler = () => {
    this.setState({selectedTool: 'brush'})
    toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid));
    
  };
  setToolSquareHandler = () => {
    this.setState({selectedTool: 'square'})
    toolState.setTool(new Square(canvasState.canvas, canvasState.socket, canvasState.sessionid))
    
  };
  setToolCircleHandler = () => {
    this.setState({selectedTool: 'circle'})
    toolState.setTool(new Circle(canvasState.canvas))
  };
  setToolEraserHandler = () => {
    this.setState({selectedTool: 'eraser'})
    toolState.setTool(new Eraser(canvasState.canvas))
  };
  setToolLineHandler = () => {
    this.setState({selectedTool: 'line'})
    toolState.setTool(new Line(canvasState.canvas))
  };
  
  download = () => { 
      const dataUrl = canvasState.canvas.toDataURL();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = canvasState.sessionid + ".jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a)
  }

  render() {

    return (
      <div className="toolbar">
        <div className="toolbar__header">
          <div className="toolbar__row">
            <button
              className="toolbar__btn icon-paintbrush"
              onClick={this.setToolBrushHandler}
            >  
            </button>
            <button
              className="toolbar__btn icon-square"
              onClick={this.setToolSquareHandler}
            ></button>
            <button className="toolbar__btn icon-circle" onClick={this.setToolCircleHandler}></button>
            <button className="toolbar__btn icon-eraser" onClick={this.setToolEraserHandler}></button>
            <input
              className="toolbar__btn"
              type="color"
              onChange={this.changeColor}
            />
            <button className="toolbar__btn rotate icon-line" onClick={this.setToolLineHandler}></button>
          </div>
          <div className="toolbar__row">
            <button className="toolbar__btn icon-arrow" onClick={() => canvasState.undo()} ></button>
            <button className="toolbar__btn arrow-reverse icon-arrow" onClick={() => canvasState.redo()}></button>
            <button className="toolbar__btn icon-save" onClick={this.download}></button>
          </div>
        </div>
      </div>
    );
  }
}
