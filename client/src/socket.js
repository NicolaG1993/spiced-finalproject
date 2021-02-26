import { chatMessages, chatMessage } from "./redux/actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        //code here
    }
};
