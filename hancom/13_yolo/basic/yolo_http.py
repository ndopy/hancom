from ultralytics import YOLO
import cv2

# stream_url = "https://strm1.spatic.go.kr/live/53.stream/playlist.m3u8"
stream_url = "http://210.99.70.120:1935/live/cctv009.stream/playlist.m3u8"

# 웹캠 연결
# cap = cv2.VideoCapture(0)

# CCTV 연결
cap = cv2.VideoCapture(stream_url)

# 모델 로드
model = YOLO("yolo11n.pt")

# 프레임 처리
while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("웹캠 또는 CCTV URL을 확인해주세요.")
        break

    results = model(frame)
    annotated_frame = results[0].plot()

    cv2.imshow("WEB_CAM", annotated_frame)

    # 'q'키를 누르면 종료하게끔 설정 (waitKey 없으면 영상이 안 보임)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌렀으므로 종료됩니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
