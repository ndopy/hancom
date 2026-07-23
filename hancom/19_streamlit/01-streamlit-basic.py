import streamlit as st
from ultralytics import YOLO
import cv2

# Streamlit 기본 페이지 설정 - 웹 화면 모양을 결정
st.set_page_config(layout="wide")  # 화면을 가로로 넓게 사용
st.title("YOLO를 이용한 실시간 CCTV 탐지")

# 영상 출력을 위한 공간 설정
frame_placeholder = st.empty()

# CCTV 비디오 스트림 연결
stream_url = "http://210.99.70.120:1935/live/cctv013.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 모델 로드
model = YOLO("yolo11n.pt")

# 비디오 프레임 처리 - CCTV 영상을 한 장씩 분석하는 것을 반복한다.
while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("프레임 읽기 실패")
        break

    results = model(frame)

    annotated_frame = results[0].plot()

    # BGR = OpenCV 색 순서
    frame_placeholder.image(annotated_frame, channels="BGR")


# 자원 해제
cap.release()
cv2.destroyAllWindows()
