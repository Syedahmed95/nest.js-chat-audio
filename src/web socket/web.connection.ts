import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
let roomID = null

@WebSocketGateway()

export class WebConnection implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server

    handleConnection(client: Socket){
        console.log("Connection Socket",client.id)
    }
    handleDisconnect(client: Socket){
        console.log("Disconnect Socket",client.id)
    }
    
    @SubscribeMessage("createRoom")
    handleRoomID(client: Socket, payload:any){
        console.log("roomID", payload)
        roomID = payload
        client.join(payload,()=>{
            console.log("Creating Room",payload)
        })        
    }

    @SubscribeMessage("joinRoom")
    joinRoom(client: Socket, payload:any){
        client.join(payload,()=>{
            console.log("Joining Room", payload)
        })
    }

    @SubscribeMessage("messageToServer")
    getMessage(client: Socket, payload:any){
        let otherRoomID = client.adapter.rooms
        let arrayID = Object.keys(otherRoomID)
        let filterSocketID = arrayID.filter((data)=>{
            return data != client.id
        })        
        this.server.to(filterSocketID[0]).emit("chat_message",payload)
    }

    @SubscribeMessage("audioRecieve")
    getAudio(client:Socket, payload:any){
        let otherRoomID = client.adapter.rooms
        let arrayID = Object.keys(otherRoomID)
        let filterSocketID = arrayID.filter((data)=>{
            return data != client.id
        })
        this.server.to(filterSocketID[0]).emit("audioMessage",payload)
    }

}