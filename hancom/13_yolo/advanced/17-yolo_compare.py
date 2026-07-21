import time

import cv2
from ultralytics import YOLO

# 모델 선택
# model = YOLO("yolo11n.pt")
model = YOLO("yolo11n_openvino_model/")

# 비디오 경로 설정
stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 프레임 처리
while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("프레임 읽기 실패")
        break

    # 추론 시간 측정
    # perf_counter : 경과 시간 전용 시계
    start_time = time.perf_counter()
    results = model(frame, verbose=False)
    end_time = time.perf_counter()

    # FPS 게산
    model_time = end_time - start_time
    fps = 1 / model_time

    annotated_frame = results[0].plot()

    cv2.putText(
        annotated_frame,
        f"FPS: {fps:.1f}",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2,
    )

    cv2.imshow("YOLO FPS", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q 키를 눌렀으므로 종료합니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
