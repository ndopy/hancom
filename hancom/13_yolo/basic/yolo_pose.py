from ultralytics import YOLO
import cv2

# 모델 로드
model = YOLO("yolo26n-pose.pt")

# 모델 추론
results = model("./input_pose.jpg")

# 결과 시각화
result_image = results[0].plot()

# 결과 이미지 저장
output_image_path = "./images/result_pose.jpg"
cv2.imwrite(output_image_path, result_image)

print(f"예측 결과 이미지가 생성되었습니다. : {output_image_path}")
