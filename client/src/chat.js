import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    console.log("CHAT COMPONENT ACTIVATED");

    return (
        <div>
            <h1>MY CONVERSATIONS</h1>
        </div>
    );
}
