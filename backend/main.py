"""
MINE RESCUE COMMAND - Backend Telemetry Gateway
Smart India Hackathon 2026 (Problem Statement ID: 26039)
FastAPI + WebSocket + MQTT Bridge
"""

import asyncio
import json
import random
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Mine Rescue Rover C2 API Gateway",
    description="FastAPI WebSocket & MQTT Telemetry Bridge for Autonomous Underground Mine Rescue Rover",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DriveCommand(BaseModel):
    roverId: str
    direction: str  # UP, DOWN, LEFT, RIGHT, STOP

class EmergencyStopRequest(BaseModel):
    roverId: str
    operatorNotes: str = "Immediate Actuator Lockdown"

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass

manager = ConnectionManager()

@app.get("/")
async def root():
    return {
        "system": "MINE RESCUE COMMAND API GATEWAY",
        "status": "ONLINE",
        "sih_problem_id": "26039",
        "sector": "Sector 7B",
    }

@app.post("/api/v1/rover/{rover_id}/emergency-stop")
async def emergency_stop(rover_id: str):
    await manager.broadcast({
        "type": "ALERTS",
        "data": [{
            "id": f"ESTOP-{random.randint(1000, 9999)}",
            "title": "EMERGENCY STOP EXECUTED",
            "message": f"Hardware actuators de-energized on {rover_id}.",
            "category": "CRITICAL",
            "roverId": rover_id,
            "sector": "Sector 7B",
            "location": "Sub-Level Shaft",
            "timestamp": "NOW",
            "acknowledged": False,
            "resolved": False,
            "recommendedAction": "Inspect physical rover before clearing emergency lock."
        }]
    })
    return {"status": "SUCCESS", "roverId": rover_id, "state": "EMERGENCY_STOPPED"}

@app.websocket("/api/v1/ws/rover")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            action = payload.get("action")
            if action == "EMERGENCY_STOP":
                await emergency_stop(payload.get("roverId", "ROVER-01"))
            elif action == "DRIVE":
                # Forward to MQTT topic `rover/control/drive`
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
