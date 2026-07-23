import streamlit as st
from ultralytics import YOLO
import cv2
import pandas as pd
import plotly.express as px
import time

# 화면 구성 - 화면을 좌우 2칸으로 분할
col1, col2 = st.columns(2)  # 같은 너비를 가지는 두 칸 만들기

with col1:
    frame_placeholder = st.empty()  # YOLO 프레임 표시용

with col2:
    chart_placeholder = st.empty()  # 객체 수 그래프 표시용


cap = cv2.VideoCapture("http://210.99.70.120:1935/live/cctv013.stream/playlist.m3u8")


# 모델 로드
@st.cache_resource  # 모델, DB 같은 무거운 자원을 캐싱한다.
def load_model():
    return YOLO("yolo11n.pt")


model = load_model()  # 두 번째 호출부터는 캐시에서 즉시 반환된다.

while cap.isOpened():
    success, frame = cap.read()

    if not success:
        st.warning("CCTV FRAME ERROR")
        break

    # YOLO 모델 객체 탐지 수행 - AI에게 사진 보여주기
    results = model(frame)

    # 탐지 결과가 그려진 프레임 이미지 생성 - 네모 박스 그리기
    annotated_frame = results[0].plot()

    # 탐지된 객체의 클래스 이름 추출 - "사람", "차"
    labels = [model.names[int(c)] for c in results[0].boxes.cls]

    if labels:
        # labels 리스트를 DataFrame 으로 변환 후 객체별 개수 집계
        df_count = pd.DataFrame({"Object": labels})
        df_count = df_count.value_counts().reset_index(name="Count")  # 종류별 개수 세기

        # Plotly를 이용해 막대 그래프 생성
        fig = px.bar(
            df_count,
            x="Object",  # 가로 축 = 사물 이름
            y="Count",  # 세로 축 = 개수
            title="탐지 객체 수",
            color="Object",  # 사물마다 색 다르게
            text="Count",  # 막대 위에 숫자 표시
        )
    else:
        df_count = pd.DataFrame({"Object": [], "Count": []})  # 빈 표 만들기

        fig = px.bar(df_count, x="Object", y="Count", title="탐지 객체 수")

    frame_placeholder.image(annotated_frame, channels="BGR")

    chart_placeholder.plotly_chart(
        fig,
        width="stretch",
        key=f"chart_{time.time()}",
        # key=f"chart_{time.time()}" : 매번 다른 이름을 부여해서 위젯 충돌 막기
    )

# 자원 해제 - CCTV 연결 끊고 창 닫기
cap.release()
cv2.destroyAllWindows()
