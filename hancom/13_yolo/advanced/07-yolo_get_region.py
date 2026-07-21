import cv2
from ultralytics import solutions

# 비디오 경로 설정
stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 마우스 이벤트 처리 함수 정의
points = []


def mouse_callback(event, x, y, flags, param):
    """
    마우스 이벤트 콜백 함수
    - 좌클릭 시 좌표를 points 리스트에 추가
    - 좌표 출력
    :param event:
    :param x:
    :param y:
    :param flags:
    :param param:
    :return:
    """
    if event == cv2.EVENT_LBUTTONDOWN:
        points.append((x, y))
        print(f"클릭된 좌표 : {x}, {y}")


# 윈도우 창 설정 및 함수 등록
cv2.namedWindow("GET_X_Y", cv2.WINDOW_NORMAL)
cv2.setMouseCallback("GET_X_Y", mouse_callback)

# 비디오 프레임 처리
while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("프레임 읽기 실패")
        break

    # 프레임 크기 조정
    re_frame = cv2.resize(frame, (640, 480))

    # 프레임 시각화
    cv2.imshow("GET_X_Y", re_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌렀으므로 종료합니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
