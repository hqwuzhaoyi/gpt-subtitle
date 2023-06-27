// translation.gateway.ts
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway(3002, {
  cors: true,
})
export class OsrtGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger("MessageGateway");

  afterInit(server: Server) {
    this.logger.log("Initialized");
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected: ${client.id}`);
    this.server.emit("connection", client.id);
  }

  notifyClient(jobId: string, status: string, data: any) {
    this.server.emit("jobUpdate", { jobId, status, data });
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(client: Socket, payload: string): Promise<void> {
    // const newMessage = await this.messagesService.createMessage(payload);
    // this.wss.emit("receiveMessage", newMessage);
  }
}
