import cv2
from ultralytics import solutions

stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

yolo_speed = solutions.SpeedEstimator(
    model="yolo11n.pt",
    show=True,
    classes=[2],  # 차량만 추적
    line_width=2,
    max_speed=120,  # 최대 속도 상한 (km/h) : 상한 초과값은 표시 안 됨
    meter_per_pixel=0.5,  # 픽셀 1개 = 실제 0.5m (환경별 직접 보정 필수)
)

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 속도 계산 및 추적 수행
    yolo_speed(frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌렀으므로 종료합니다.")
        break

cap.release()
cv2.destroyAllWindows()
