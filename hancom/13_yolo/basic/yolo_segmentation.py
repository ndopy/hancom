from ultralytics import YOLO


# 모델 로드
model = YOLO("yolo26n-seg.pt")

# 모델 추론
results = model("./input_segmentation.jpg", save=True)
