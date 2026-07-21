from ultralytics import solutions
import cv2

# 비디오 경로 설정
cap = cv2.VideoCapture(0)

# 모델 로드
blurrer = solutions.ObjectBlurrer(model="yolo11n.pt", show=False, blur_ratio=0.5)

# 비디오 프레임 처리
while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("웹캠 읽기 실패")
        break

    results = blurrer(frame)

    cv2.imshow("BLUR", results.plot_im)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌렀으므로 종료합니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
