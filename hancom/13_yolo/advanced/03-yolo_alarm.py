from ultralytics import solutions
import cv2

# 비디오 경로 설정
stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 이메일 인증
from_email = "이메일 주소"
password = "앱 비밀번호"
to_email = "이메일 주소"

# 모델 로드 및 알람 객체 생성
google_alarm = solutions.SecurityAlarm(
    model="yolo11n.pt",
    show=False,
    records=2,  # 동일 객체 N회 감지 시 1회 메일 (기본값: 5)
    classes=[2],  # 탐지 대상 COCO 클래스 (2 = 자동차)
)


# 이메일 서버 인증
google_alarm.authenticate(from_email, password, to_email)

# 프레임 처리
while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("프레임 읽기 실패")
        break

    # 보안 감시 수행
    results = google_alarm(frame)

    cv2.imshow("ALARM", results.plot_im)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌렀으므로 종료합니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
