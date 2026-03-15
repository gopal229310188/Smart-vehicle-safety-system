AI-Based Smart Vehicle Safety and Driver Monitoring System
Overview

The AI-Based Smart Vehicle Safety and Driver Monitoring System is a computer vision based application developed to monitor driver behavior in real time and detect signs of fatigue or distraction while driving.

Driver fatigue is one of the major causes of road accidents. Long driving hours, lack of sleep, and loss of attention can lead to dangerous situations on the road. This project demonstrates how artificial intelligence and computer vision techniques can be used to monitor the driver’s facial behavior and identify unsafe conditions before they lead to accidents.

The system uses a camera to capture the driver’s face and analyzes facial movements using MediaPipe FaceMesh and OpenCV. Based on this analysis, the system detects signs such as eye closure, yawning, and driver distraction. When such behavior is detected, the system generates alerts and logs the event in the monitoring dashboard.

The project also includes a web-based interface developed using React, which displays the live video feed, driver status, fatigue score, and detection logs.

Problem Statement

Driver fatigue and distraction are responsible for a significant number of road accidents worldwide. Drivers who are tired or distracted may experience slower reaction times and reduced awareness of their surroundings.

While modern vehicles include driver monitoring systems, these solutions are typically available only in high-end cars and rely on specialized hardware.

The objective of this project is to design a software-based driver monitoring system that uses computer vision techniques to detect fatigue and distraction using a standard camera. The system continuously analyzes the driver’s facial features and generates warnings whenever unsafe driving conditions are detected.

Features

The system provides the following functionalities:

Facial Landmark Detection
The system detects facial landmarks using MediaPipe FaceMesh, which identifies key points on the face to analyze facial movements.

Driver Fatigue Detection
The system monitors indicators such as prolonged eye closure and yawning to detect signs of driver fatigue.

Driver Distraction Detection
The system tracks head movement and identifies when the driver looks away from the road.

Fatigue Score Calculation
Multiple indicators are combined to calculate a fatigue score representing the driver’s alertness level.

Alert System
If fatigue or distraction is detected, the system triggers visual alerts on the dashboard and an alarm sound.

Event Logging
All detected events are recorded in a timeline panel for monitoring and analysis.

Real-Time Monitoring Dashboard
A React-based dashboard displays the live camera feed, facial landmark overlay, driver status, fatigue score, and event logs.

System Architecture

The system follows a modular architecture consisting of a backend processing layer and a frontend visualization layer.

Camera Input
A camera captures live video of the driver.

Frame Processing
Video frames are processed using OpenCV.

Face Detection
The driver’s face is detected in each frame.

Facial Landmark Detection
MediaPipe FaceMesh detects facial landmarks on the face.

Feature Extraction
Eye closure, yawning, and head pose are analyzed.

Driver Monitoring Module
The system evaluates driver behavior based on these indicators.

Fatigue Score Calculation
A fatigue score is calculated based on the observed indicators.

Alert System
If the fatigue score exceeds a threshold, alerts are generated.

Dashboard Visualization
Results are displayed on the React-based monitoring dashboard.

Technologies Used

Backend
Python
OpenCV
MediaPipe FaceMesh
Flask API

Frontend
React.js
Vite
Tailwind CSS

Development Tools
Visual Studio Code
Git and GitHub

Project Structure
Smart-vehicle-safety-system
│
├── backend
│   ├── app.py
│   ├── drowsiness_detector.py
│   ├── utils.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── README.md
└── .gitignore
Installation and Setup

Clone the repository

git clone https://github.com/gopal229310188/Smart-vehicle-safety-system.git
cd Smart-vehicle-safety-system

Backend setup

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

The backend server will start on

http://127.0.0.1:5050

Frontend setup

Open a new terminal window.

cd frontend
npm install
npm run dev

The frontend application will run on

http://localhost:5173
Future Scope

The system can be extended with additional safety features such as mobile phone usage detection, seatbelt detection, and driver identity recognition. Integration with vehicle systems or cloud platforms could also enable large-scale monitoring for fleet management and transportation safety applications.

Author

Gopal Chawla
B.Tech Computer Science Engineering (AI and Machine Learning)
Manipal University Jaipur
