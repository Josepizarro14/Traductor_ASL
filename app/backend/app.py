from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import base64
import os

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    #allow_origins=["*"],
    allow_origins=["https://traductor-asl.vercel.app"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


print("Cargando modelo")
script_dir = os.path.dirname(os.path.abspath(__file__))
model = tf.keras.models.load_model(os.path.join(script_dir, 'traductor_sena.keras'))
classes = np.load(os.path.join(script_dir, 'classes.npy'), allow_pickle=True)
print("Modelo cargado")

# Configurar MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.5
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
      
            data = await websocket.receive_text()
            
    
            header, encoded = data.split(",", 1)
            img_bytes = base64.b64decode(encoded)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

  
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(frame_rgb)

            response = {"letter": "", "confidence": 0.0}

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    data_aux = []
                    for lm in hand_landmarks.landmark:
                        data_aux.extend([lm.x, lm.y, lm.z])
                    
                    prediction = model.predict(np.array([data_aux]), verbose=0)
                    class_index = np.argmax(prediction)
                    class_name = str(classes[class_index])
                    confidence = float(np.max(prediction))
                    
           
                    if confidence > 0.8:
                        response = {
                            "letter": class_name,
                            "confidence": confidence
                        }
            

            await websocket.send_json(response)

    except WebSocketDisconnect:
        print("Cliente desconectado")
    except Exception as e:
        print(f"Error: {e}")