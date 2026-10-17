import { Tool } from '@/components/Canvas';
import { getExistingShapes } from './http';

type Shape = (
  | {
      type: 'rect';
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: 'circle';
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: 'pencil';
      points: { x: number; y: number }[];
    }
) & {
  id?: number;
};

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private currentPencilPoints: { x: number; y: number }[] = [];

  private offsetX = 0;
  private offsetY = 0;
  private scale = 1;
  private isPanning = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private selectedTool: Tool = 'circle';

  socket: WebSocket;

  private drawPencil(points: { x: number; y: number }[]) {
    if (points.length < 2) return;

    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2 / this.scale;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }
  private getMousePosition(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();

    const screenX = (e.clientX - rect.left) * (this.canvas.width / rect.width);

    const screenY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    return {
      x: (screenX - this.offsetX) / this.scale,
      y: (screenY - this.offsetY) / this.scale,
    };
  }
  private renderCanvas() {
    const { width, height } = this.canvas;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, width, height);

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      this.offsetX,
      this.offsetY,
    );

    this.existingShapes.forEach((shape) => {
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 2 / this.scale;

      if (shape.type === 'rect') {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.radius),
          0,
          Math.PI * 2,
        );
        this.ctx.stroke();
      } else if (shape.type === 'pencil') {
        this.drawPencil(shape.points);
      }
    });
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private panMouseDownHandler = (e: MouseEvent) => {
    const isHandDrag = this.selectedTool === 'hand' && e.button === 0;

    const isMiddleMouseDrag = e.button === 1;

    if (!isHandDrag && !isMiddleMouseDrag) return;

    e.preventDefault();

    this.isPanning = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    this.canvas.style.cursor = 'grabbing';
  };
  private panMouseMoveHandler = (e: MouseEvent) => {
    if (!this.isPanning) return;

    const rect = this.canvas.getBoundingClientRect();

    const dx = (e.clientX - this.lastMouseX) * (this.canvas.width / rect.width);

    const dy =
      (e.clientY - this.lastMouseY) * (this.canvas.height / rect.height);

    this.offsetX += dx;
    this.offsetY += dy;

    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    this.renderCanvas();
  };

private panMouseUpHandler = () => {
  this.isPanning = false;

  this.canvas.style.cursor =
    this.selectedTool === 'hand'
      ? 'grab'
      : this.selectedTool === 'eraser'
        ? 'cell'
        : 'crosshair';
};
  private wheelHandler = (e: WheelEvent) => {
    e.preventDefault();

    const rect = this.canvas.getBoundingClientRect();

    const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);

    const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    const worldX = (mouseX - this.offsetX) / this.scale;
    const worldY = (mouseY - this.offsetY) / this.scale;

    const zoomFactor = Math.exp(-e.deltaY * 0.003);

    this.scale = Math.min(4, Math.max(0.1, this.scale * zoomFactor));

    this.offsetX = mouseX - worldX * this.scale;
    this.offsetY = mouseY - worldY * this.scale;

    this.renderCanvas();
  };
  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener('mousedown', this.mouseDownHandler);

    this.canvas.removeEventListener('mouseup', this.mouseUpHandler);

    this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);

    this.canvas.removeEventListener('mousedown', this.panMouseDownHandler);

    this.canvas.removeEventListener('mousemove', this.panMouseMoveHandler);

    window.removeEventListener('mouseup', this.panMouseUpHandler);

    this.canvas.removeEventListener('wheel', this.wheelHandler);
  }

setTool(tool: 'circle' | 'pencil' | 'rect' | 'hand' | 'eraser') {
  this.selectedTool = tool;

  this.canvas.style.cursor =
    tool === 'hand'
      ? 'grab'
      : tool === 'eraser'
        ? 'cell'
        : 'crosshair';
}
  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    console.log(this.existingShapes);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type !== 'chat') return;

      const parsedMessage = JSON.parse(message.message);

      // Remove the erased shape on every connected client
      if (parsedMessage.action === 'erase') {
        this.existingShapes = this.existingShapes.filter(
          (shape) => shape.id !== parsedMessage.shapeId,
        );

        this.clearCanvas();
        return;
      }

      // Add a newly drawn shape with its database ID
      if (parsedMessage.shape) {
        const shape = {
          ...parsedMessage.shape,
          id: message.chatId,
        };

        if (
          !this.existingShapes.some(
            (existingShape) => existingShape.id === shape.id,
          )
        ) {
          this.existingShapes.push(shape);
        }

        this.clearCanvas();
      }
    };
  }

  resetView() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1;

    this.renderCanvas();
  }
  clearCanvas() {
    this.renderCanvas();
  }

  private isPointOnShape(x: number, y: number, shape: Shape): boolean {
    const tolerance = 10 / this.scale;

    if (shape.type === 'rect') {
      const left = Math.min(shape.x, shape.x + shape.width);
      const right = Math.max(shape.x, shape.x + shape.width);
      const top = Math.min(shape.y, shape.y + shape.height);
      const bottom = Math.max(shape.y, shape.y + shape.height);

      // Erase when touching the rectangle's outline
      const insideBounds =
        x >= left - tolerance &&
        x <= right + tolerance &&
        y >= top - tolerance &&
        y <= bottom + tolerance;

      const nearEdge =
        Math.abs(x - left) <= tolerance ||
        Math.abs(x - right) <= tolerance ||
        Math.abs(y - top) <= tolerance ||
        Math.abs(y - bottom) <= tolerance;

      return insideBounds && nearEdge;
    }

    if (shape.type === 'circle') {
      const distance = Math.hypot(x - shape.centerX, y - shape.centerY);

      return Math.abs(distance - Math.abs(shape.radius)) <= tolerance;
    }

    if (shape.type === 'pencil') {
      const points = shape.points;

      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const lengthSquared = dx * dx + dy * dy;

        const t =
          lengthSquared === 0
            ? 0
            : Math.max(
                0,
                Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / lengthSquared),
              );

        const nearestX = a.x + t * dx;
        const nearestY = a.y + t * dy;

        if (Math.hypot(x - nearestX, y - nearestY) <= tolerance) {
          return true;
        }
      }
    }

    return false;
  }

  private eraseAt(x: number, y: number) {
    for (let i = this.existingShapes.length - 1; i >= 0; i--) {
      const shape = this.existingShapes[i];

      if (!this.isPointOnShape(x, y, shape)) continue;

      // A shape without a database ID cannot be deleted persistently.
      if (shape.id === undefined) {
        console.warn('Cannot erase shape without a database ID');
        return;
      }

      const shapeId = shape.id;

      // Remove locally for an immediate response
      this.existingShapes.splice(i, 1);
      this.renderCanvas();

      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(
          JSON.stringify({
            type: 'chat',
            roomId: this.roomId,
            message: JSON.stringify({
              action: 'erase',
              shapeId,
            }),
          }),
        );
      }

      return;
    }
  }
  mouseDownHandler = (e: MouseEvent) => {
    if (e.button !== 0 || this.isPanning || this.selectedTool === 'hand')
      return;

    this.clicked = true;

    const { x, y } = this.getMousePosition(e);

    this.startX = x;
    this.startY = y;
    if (this.selectedTool === 'eraser') {
      this.clicked = true;
      this.eraseAt(x, y);
      return;
    }
    if (this.selectedTool === 'pencil') {
      this.currentPencilPoints = [{ x, y }];
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    if (e.button !== 0 || !this.clicked) return;

    this.clicked = false;

    const { x, y } = this.getMousePosition(e);
    const width = x - this.startX;
    const height = y - this.startY;

    let shape: Shape | null = null;

    if (this.selectedTool === 'pencil') {
      this.currentPencilPoints.push({ x, y });

      if (this.currentPencilPoints.length >= 2) {
        shape = {
          type: 'pencil',
          points: [...this.currentPencilPoints],
        };
      }

      this.currentPencilPoints = [];
    } else if (this.selectedTool === 'rect') {
      shape = {
        type: 'rect',
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (this.selectedTool === 'circle') {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

      shape = {
        type: 'circle',
        centerX: this.startX + width / 2,
        centerY: this.startY + height / 2,
        radius,
      };
    }

    if (!shape) {
      this.clearCanvas();
      return;
    }

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'chat',
          roomId: this.roomId,
          message: JSON.stringify({ shape }),
        }),
      );
    }

    this.clearCanvas();
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (!this.clicked || this.isPanning) return;

    const { x, y } = this.getMousePosition(e);

    if (this.selectedTool === 'eraser') {
      this.eraseAt(x, y);
      return;
    }

    const width = x - this.startX;
    const height = y - this.startY;

    this.renderCanvas();

    this.ctx.save();

    this.ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      this.offsetX,
      this.offsetY,
    );

    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2 / this.scale;

    if (this.selectedTool === 'pencil') {
      this.currentPencilPoints.push({ x, y });
      this.drawPencil(this.currentPencilPoints);
    } else if (this.selectedTool === 'rect') {
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (this.selectedTool === 'circle') {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    }

    this.ctx.restore();
  };

  initMouseHandlers() {
    this.canvas.addEventListener('mousedown', this.mouseDownHandler);

    this.canvas.addEventListener('mouseup', this.mouseUpHandler);

    this.canvas.addEventListener('mousemove', this.mouseMoveHandler);

    this.canvas.addEventListener('mousedown', this.panMouseDownHandler);

    this.canvas.addEventListener('mousemove', this.panMouseMoveHandler);

    window.addEventListener('mouseup', this.panMouseUpHandler);
    this.canvas.addEventListener('wheel', this.wheelHandler, {
      passive: false,
    });
  }
}
