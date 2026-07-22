from ultralytics import YOLO
import cv2
from v15_03_cctv_its_def import its_cctv

# cctv 주소 가져오기
test_url = its_cctv(50)

# 비디오 경로 설정
cap = cv2.VideoCapture(test_url)

# YOLO 모델 로드
model = YOLO("yolo11n.pt")

# 프레임 처리
while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("프레임 읽기 실패")
        break

    # 모델 추론
    results = model(frame)

    # 결과 이미지
    annotated_frame = results[0].plot()

    # 윈도우 생성
    cv2.namedWindow("ITS_YOLO", cv2.WINDOW_NORMAL)

    # 화면에 표시
    cv2.imshow("ITS_YOLO", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("Q키를 눌렀으므로 종료합니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
