import { io } from "socket.io-client";

const socket = io("http://localhost:6000"); // Backend URL

export default socket;