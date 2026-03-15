import math

def calculate_distance(p1, p2):
    return math.hypot(p1.x - p2.x, p1.y - p2.y)

def calculate_ear(eye_landmarks, face_landmarks):
    """Calculate Eye Aspect Ratio"""
    v1 = calculate_distance(face_landmarks.landmark[eye_landmarks[1]], face_landmarks.landmark[eye_landmarks[5]])
    v2 = calculate_distance(face_landmarks.landmark[eye_landmarks[2]], face_landmarks.landmark[eye_landmarks[4]])
    h = calculate_distance(face_landmarks.landmark[eye_landmarks[0]], face_landmarks.landmark[eye_landmarks[3]])
    return (v1 + v2) / (2.0 * h) if h > 0 else 0

def calculate_mor(mouth_landmarks, face_landmarks):
    """Calculate Mouth Opening Ratio"""
    v1 = calculate_distance(face_landmarks.landmark[mouth_landmarks[2]], face_landmarks.landmark[mouth_landmarks[6]])
    h = calculate_distance(face_landmarks.landmark[mouth_landmarks[0]], face_landmarks.landmark[mouth_landmarks[4]])
    return v1 / h if h > 0 else 0
    
def get_head_tilt(face_landmarks, tilt_threshold_degrees=20):
    """Detect if the head is tilted beyond a certain threshold."""
    # Using eye centers for simple roll calculation
    left_eye_center = face_landmarks.landmark[468] 
    right_eye_center = face_landmarks.landmark[473]
    
    eye_y_diff = left_eye_center.y - right_eye_center.y
    eye_x_diff = right_eye_center.x - left_eye_center.x
    angle = math.degrees(math.atan2(eye_y_diff, eye_x_diff))
    
    return abs(angle) > tilt_threshold_degrees

def get_head_pose(face_landmarks):
    """Estimate head pose direction (Forward, Left, Right, Down)"""
    nose = face_landmarks.landmark[1]
    left_eye = face_landmarks.landmark[33]
    right_eye = face_landmarks.landmark[263]
    chin = face_landmarks.landmark[152]
    
    # Horizontal distances
    left_dist = abs(nose.x - left_eye.x)
    right_dist = abs(nose.x - right_eye.x)
    
    # Vertical distances
    eye_y = (left_eye.y + right_eye.y) / 2
    nose_to_eye_y = abs(nose.y - eye_y)
    nose_to_chin_y = abs(nose.y - chin.y)
    
    # Ratios
    yaw_ratio = left_dist / (right_dist + 1e-6)
    pitch_ratio = nose_to_eye_y / (nose_to_chin_y + 1e-6)
    
    if yaw_ratio > 1.8:
        return 'Right'
    elif yaw_ratio < 0.55:
        return 'Left'
        
    if pitch_ratio < 0.5:
        return 'Down'
        
    return 'Forward'
