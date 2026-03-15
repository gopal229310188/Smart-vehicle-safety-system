from flask import Flask, Response, jsonify
from flask_cors import CORS
from drowsiness_detector import VideoCamera

app = Flask(__name__)
CORS(app)

# Global camera instance
camera = VideoCamera()

@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(camera.generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/status')
def status():
    """Returns the current fatigue status and score."""
    return jsonify(camera.detector.get_status())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, threaded=True)
