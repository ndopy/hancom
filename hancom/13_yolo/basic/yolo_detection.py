from ultralytics import YOLO
import cv2
import os

# 모델 로드
model = YOLO("yolo26n.pt")

# 모델 추론
# https://docs.ultralytics.com/ko/models/yolo26#%EC%A7%80%EC%9B%90%EB%90%98%EB%8A%94-%EC%9E%91%EC%97%85-%EB%B0%8F-%EB%AA%A8%EB%93%9C
results = model("./seoul.jpg")

# 결과 시각화
result_image = results[0].plot()

# 결과 이미지 저장
os.makedirs("./images", exist_ok=True)
output_image_path = "./images/result_seoul.jpg"
cv2.imwrite(output_image_path, result_image)

print(f"예측 결과 이미지가 저장되었습니다. : {output_image_path}")
