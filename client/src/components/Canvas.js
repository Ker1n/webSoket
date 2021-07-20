import { observer } from "mobx-react-lite";
import React from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/canvas.scss";
import Brush from "../tools/Brush";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Square from '../tools/Square';
import axios from 'axios'

export const Canvas = observer(() => {
  const canvasRef = React.useRef();
  const userNameRef = React.useRef("");
  const [modal, setModal] = React.useState(true);
  const params = useParams(0);

  React.useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    let ctx = canvasRef.current.getContext('2d')
    axios.get(`http://localhost:5000/image?id=${params.id}`)
        .then(response => {
            const img = new Image()
            img.src = response.data
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
            }
        })
}, [])

React.useEffect(() => {
    if (canvasState.username) {
        const socket = new WebSocket(`ws://localhost:5000/`);
        canvasState.setSocket(socket)
        canvasState.setSessionId(params.id)
        toolState.setTool(new Brush(canvasRef.current, socket, params.id))
        socket.onopen = () => {
            console.log('Подключение установлено')
            socket.send(JSON.stringify({
                id:params.id,
                username: canvasState.username,
                method: "connection"
            }))
        }
        socket.onmessage = (event) => {
            let msg = JSON.parse(event.data)
            switch (msg.method) {
                case "connection":
                    console.log(`пользователь ${msg.username} присоединился`)
                    break
                case "draw":
                    drawHandler(msg)
                    break
                    default: break
            }
        }
    }
}, [canvasState.username])

const drawHandler = (msg) => {
    const figure = msg.figure
    const ctx = canvasRef.current.getContext('2d')
    switch (figure.type) {
        case "brush":
            Brush.draw(ctx, figure.x, figure.y)
            break
        case "rect":
        Square.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
            break
        case "finish":
            ctx.beginPath()
            break
            default: break
    }
}


const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
    axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
        .then(response => console.log(response.data))
}

const connectHandler = () => {
    canvasState.setUsername(userNameRef.current.value)
    setModal(false)
}

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Имя
            </InputGroup.Text>
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              ref={userNameRef}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={connectHandler}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseDown={mouseDownHandler}
        ref={canvasRef}
        width={1100}
        height={560}
      ></canvas>
    </div>
  );
});
