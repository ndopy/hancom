import cv2
from ultralytics import solutions

stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"

cap = cv2.VideoCapture(stream_url)

distance = solutions.DistanceCalculation(model="yolo11n.pt", show=True)

while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("프레임 읽기 실패")
        break

    results = distance.process(frame)

    pixel_distance = results.pixels_distance

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌렀으므로 종료합니다")
        break

    if pixel_distance is None or pixel_distance == 0:
        print("[거리] ----px [상태] 입력 안됨")
        continue

    if pixel_distance >= 150:
        status = "SAFE"
    elif pixel_distance >= 100:
        status = "WARNING"
    else:
        status = "DANGER"

    print(f"[거리] {pixel_distance}px [상태] {status}")

cap.release()
cv2.destroyAllWindows()
