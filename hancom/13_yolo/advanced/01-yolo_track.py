from ultralytics import YOLO
import cv2

stream_url = "http://210.99.70.120:1935/live/cctv009.stream/playlist.m3u8"

# 비디오 경로 설정
cap = cv2.VideoCapture(stream_url)

# 모델 로드
model = YOLO("yolo11s.pt")

# 프레임 처리
while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("프레임 읽기 실패!")
        break

    # 객체 추적하기
    results = model.track(frame, persist=True, conf=0.6)
    # persist=True => 이전 프레임 정보 유지

    # 추적한 결과를 시각화
    annotated_frame = results[0].plot()

    # 결과 화면 조절
    cv2.namedWindow("YOLO_TRACKING", cv2.WINDOW_NORMAL)
    cv2.imshow("YOLO_TRACKING", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌렀으므로 종료합니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
