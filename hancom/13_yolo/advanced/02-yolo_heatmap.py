from ultralytics import solutions
import cv2

# 비디오 경로 설정
stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"

cap = cv2.VideoCapture(stream_url)

# 모델 로드 및 히트맵 객체 생성
heatmap = solutions.Heatmap(model="yolo11n.pt", show=False, colormap=cv2.COLORMAP_MAGMA)

# 비디오 프레임 처리
while cap.isOpened():
    success, frame = cap.read()

    if not success:
        print("웹캠 읽기 실패")
        break

    # 누적 히트맵 갱신 (인스턴스 직접 호출, show=True면 내부에서 창까지 그려줌)
    # 반환값은 SolutionResults 객체 - YOLO 추론처럼 results[0].plot() 으로 사용하지 않음
    results = heatmap(frame)

    # 결과 이미지 저장
    annotated_frame = results.plot_im

    # 윈도우 창
    cv2.imshow("HEATMAP", annotated_frame)

    # q키를 누르면 종료한다.
    if cv2.waitKey(1) & 0xFF == ord("q"):
        print("q키를 눌렀으므로 종료합니다.")
        break

# 자원 해제
cap.release()
cv2.destroyAllWindows()
