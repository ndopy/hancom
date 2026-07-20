from ultralytics import YOLO
import cv2

# CCTV 스트리밍 URL 설정
stream_url = "http://210.99.70.120:1935/live/cctv009.stream/playlist.m3u8"

cap = cv2.VideoCapture(stream_url)

# 모델 로드
model = YOLO("yolo11n.pt")

# 위험 판단 기준
WARNING_THRESHOLD = 5

# 실시간 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("웹캠 읽기 실패")
        break

    # YOLO 추론
    results = model(frame)

    # 탐지 박스 그린 프레임 생성
    annotated_frame = results[0].plot()

    # 탐지 객체 수
    count = len(results[0].boxes)

    # 탐지된 객체 수 기준으로 상태 및 색상 변경 결정
    if count >= WARNING_THRESHOLD:
        status = "Warning"
        color = (0, 0, 255)
    else:
        status = "Safe"
        color = (255, 0, 0)

    # 탐지 객체 수 및 상태를 화면에 표시하기
    cv2.putText(
        annotated_frame,  # 글자를 그릴 영상(프레임)
        f"Detected : {count}, {status}",  # 출력할 문자열
        (10, 30),  # 좌측 상단 시작 좌표 (x=10, y=3)
        cv2.FONT_HERSHEY_SIMPLEX,  # 폰트 스타일 (가장 보편적으로 많이 사용)
        1,  # 폰트 크기 배율 (1.0 = 기본)
        color,  # 글자색 (B, G, R)
        2,  # 글자 두께 (픽셀)
        cv2.LINE_AA,  # (옵션) 안티앨리어싱 - 글자 매끈하게
    )

    # OpenCV 윈도우 출력
    cv2.imshow("CCTV Detection", annotated_frame)

    # q키를 누르면 종료되도록 설정
    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌렀으므로 종료합니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
