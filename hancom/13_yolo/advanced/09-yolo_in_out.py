import cv2
from ultralytics import solutions

# 비디오 경로 설정
stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 카운팅 선 설정

# 클릭된 좌표 : 203, 318
# 클릭된 좌표 : 468, 318
count_points = [(203, 318), (468, 318)]  # 좌하단-우상단 사선

counter = solutions.ObjectCounter(model="yolo11n.pt", show=False, region=count_points)

while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("프레임 읽기 실패")
        break

    resized_frame = cv2.resize(frame, (640, 480))

    results = counter(resized_frame)

    cv2.imshow("IN_OUT", results.plot_im)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q 키를 눌렀으므로 종료합니다.")
        break

cap.release()
cv2.destroyAllWindows()
