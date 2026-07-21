from ultralytics import solutions

# Streamlit 추론 인스턴스 생성
inf = solutions.Inference(model="yolo11n.pt")

inf.inference()
