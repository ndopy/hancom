from ultralytics import YOLO


model = YOLO("yolo26s.pt")

print(model.names)

# 모델 파라미터
model(
    "./input_params.jpg",  # 이미지 경로
    save=True,
    # conf=0.5,  # 신뢰도 50% 이상만 탐지한다.
    # max_det=3,  # 탐지할 최대 개수 -> 이 3개가 결정되는 기준은? 신뢰도가 높은 순? 아니면 랜덤?
    # save_crop=True,  # 탐지한 영역의 이미지를 저장한다.
    # save_txt=True,  # 탐지한 영역의 좌표를 텍스트로 저장한다.
    # save_conf=True,  # 신뢰도를 저장한다. (save_txt 와 함께 사용해야함.)
    classes=[60, 75],
)
