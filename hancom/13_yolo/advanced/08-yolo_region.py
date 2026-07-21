import cv2
from ultralytics import solutions

stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"

cap = cv2.VideoCapture(stream_url)

# 좌상단 : 13, 14
# 좌하단 : 15, 461
# 우하단 : 610, 449
# 우상단 : 617, 18

# 좌상단부터 시작해서 반시계 방향으로 좌표를 설정해야한다.
region_points = {"region-01": [(13, 14), (15, 461), (610, 449), (617, 18)]}

yolo_region = solutions.RegionCounter(
    model="yolo11n.pt", show=False, region=region_points, conf=0.1
)

while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("프레임 읽기 실패")
        break

    # 프레임 크기 조정
    re_frame = cv2.resize(frame, (640, 480))

    # 구역 내 객체 수 계산

    results = yolo_region(re_frame)
    cv2.imshow("Region", results.plot_im)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌러서 종료합니다.")
        break

cap.release()
cv2.destroyAllWindows()
