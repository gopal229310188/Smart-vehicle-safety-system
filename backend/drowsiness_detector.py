import cv2
import mediapipe as mp
import time
from utils import calculate_ear, calculate_mor, get_head_tilt, get_head_pose

class DrowsinessDetector:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Landmarks for eyes
        self.LEFT_EYE = [362, 385, 387, 263, 373, 380]
        self.RIGHT_EYE = [33, 160, 158, 133, 153, 144]
        
        # Landmarks for mouth (inner lips)
        self.MOUTH = [78, 81, 13, 311, 308, 402, 14, 178]

        # Thresholds
        self.EAR_THRESHOLD = 0.23
        self.MOR_THRESHOLD = 0.6
        self.CLOSED_EYES_FRAME_THRESHOLD = 20 # Frames
        
        # State
        self.closed_eyes_frames = 0
        self.fatigue_score = 0
        self.status = "Driver Active"
        self.logs = []
        self.last_log_time = time.time()
        
    def add_log(self, message):
        current_time = time.time()
        # Ensure we don't spam logs too frequently
        if current_time - self.last_log_time > 1:
            timestamp = time.strftime("%H:%M:%S")
            self.logs.insert(0, {"timestamp": timestamp, "event": message})
            if len(self.logs) > 15:
                self.logs.pop()
            self.last_log_time = current_time

    def process_frame(self, frame):
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(frame_rgb)
        
        h, w, _ = frame.shape
        
        is_drowsy = False
        is_yawning = False
        is_distracted = False

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Calculate EAR
                left_ear = calculate_ear(self.LEFT_EYE, face_landmarks)
                right_ear = calculate_ear(self.RIGHT_EYE, face_landmarks)
                ear = (left_ear + right_ear) / 2.0
                
                # Calculate MOR
                mor = calculate_mor(self.MOUTH, face_landmarks)
                
                # Drowsiness detection logic
                if ear < self.EAR_THRESHOLD:
                    self.closed_eyes_frames += 1
                else:
                    self.closed_eyes_frames = max(0, self.closed_eyes_frames - 2)
                    
                if self.closed_eyes_frames >= self.CLOSED_EYES_FRAME_THRESHOLD:
                    is_drowsy = True
                    self.fatigue_score = min(100, self.fatigue_score + 5)
                    self.add_log("Drowsiness detected (Eyes closed)")
                    
                # Yawn detection logic
                if mor > self.MOR_THRESHOLD:
                    is_yawning = True
                    self.fatigue_score = min(100, self.fatigue_score + 2)
                    self.add_log("Yawning detected")
                    
                # Head tracking box
                xs = [int(landmark.x * w) for landmark in face_landmarks.landmark]
                ys = [int(landmark.y * h) for landmark in face_landmarks.landmark]
                x_min, x_max = min(xs), max(xs)
                y_min, y_max = min(ys), max(ys)
                
                # Head Pose for distraction
                head_pose = get_head_pose(face_landmarks)
                if head_pose in ['Left', 'Right', 'Down']:
                    is_distracted = True
                    self.fatigue_score = min(100, self.fatigue_score + 2)
                    self.add_log(f"Driver Distracted (Looking {head_pose})")
                
                # Calculate head tilt (roll)
                if get_head_tilt(face_landmarks):
                    self.fatigue_score = min(100, self.fatigue_score + 1)
                    self.add_log("Abnormal Head Tilt detected")
                
                # Recovery
                if not is_drowsy and not is_yawning and not is_distracted:
                    self.fatigue_score = max(0, self.fatigue_score - 1)

                # Visuals
                # Draw Box
                cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (255, 255, 0), 2)
                
                # Draw All Landmarks for overlay feature
                for landmark in face_landmarks.landmark:
                    lx = int(landmark.x * w)
                    ly = int(landmark.y * h)
                    cv2.circle(frame, (lx, ly), 1, (0, 255, 0), -1)
                    
        # Update overall status
        if is_distracted and self.fatigue_score < 70:
            self.status = "Driver Distracted"
            cv2.putText(frame, f"DISTRACTED ({self.fatigue_score}%)", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 165, 255), 3)
        elif self.fatigue_score >= 70:
            self.status = "Drowsiness Detected"
            cv2.putText(frame, f"DROWSINESS ALERT ({self.fatigue_score}%)", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
        elif self.fatigue_score >= 40:
            self.status = "Warning"
            cv2.putText(frame, f"WARNING ({self.fatigue_score}%)", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 165, 255), 3)
        else:
            self.status = "Driver Active"
            cv2.putText(frame, f"ACTIVE ({self.fatigue_score}%)", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
        return frame
            
    def get_status(self):
        return {
            "status": self.status,
            "fatigue_score": self.fatigue_score,
            "logs": self.logs
        }


class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.detector = DrowsinessDetector()
        
    def __del__(self):
        if self.video.isOpened():
            self.video.release()
        
    def get_frame(self):
        if not self.video.isOpened():
            return None
            
        success, image = self.video.read()
        if not success:
            return None
        
        # Mirror image
        image = cv2.flip(image, 1)
        
        # Process frame
        processed_image = self.detector.process_frame(image)
        
        # Encode as JPEG
        ret, jpeg = cv2.imencode('.jpg', processed_image)
        if not ret:
            return None
        return jpeg.tobytes()
        
    def generate_frames(self):
        while True:
            frame = self.get_frame()
            if frame is None:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
