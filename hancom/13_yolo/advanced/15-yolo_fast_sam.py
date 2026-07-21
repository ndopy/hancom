import cv2
from ultralytics import FastSAM

# stream_url = "http://210.99.70.120:1935/live/cctv001.stream/playlist.m3u8"
# cap = cv2.VideoCapture(stream_url)

source = "./demo_data/dog-and-people.jpg"

model = FastSAM("FastSAM-s.pt")
results = model(source, texts="dog")

output_path = "output_result.jpg"
output_image = results[0].plot()

cv2.imwrite(output_path, output_image)

print(f"결과 이미지가 저장됐습니다. {output_path}")
