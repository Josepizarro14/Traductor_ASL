import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import os


script_dir = os.path.dirname(os.path.abspath(__file__))


print("Cargando modelo")
model = tf.keras.models.load_model(os.path.join(script_dir, 'traductor_sena.keras'))
classes = np.load(os.path.join(script_dir, 'classes.npy'), allow_pickle=True)
print("Modelo cargado")


mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles


hands = mp_hands.Hands(
    static_image_mode=False, 
    max_num_hands=1, 
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)


cap = cv2.VideoCapture(0) 

while True:
    ret, frame = cap.read()
    if not ret:
        break


    frame = cv2.flip(frame, 1)


    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)


    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            
            
            data_aux = []
            for lm in hand_landmarks.landmark:
                data_aux.extend([lm.x, lm.y, lm.z])
            
          
            prediction = model.predict(np.array([data_aux]), verbose=0)
            
           
            class_index = np.argmax(prediction)
            class_name = classes[class_index]
            confidence = np.max(prediction)

            
            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style()
            )

            
            cv2.rectangle(frame, (0, 0), (300, 60), (0, 0, 0), -1)
            cv2.putText(frame, f"{class_name} ({confidence*100:.1f}%)", 
                        (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 
                        1.2, (255, 255, 255), 2, cv2.LINE_AA)


    cv2.imshow('Traductor de en tiempo real', frame)


    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
hands.close()