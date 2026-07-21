from sahi import AutoDetectionModel
from sahi.predict import get_sliced_prediction

model_path = "yolo11n.pt"

detection_model = AutoDetectionModel.from_pretrained(
    model_type="ultralytics", model_path=model_path, confidence_threshold=0.4
)

results = get_sliced_prediction(
    "./demo_data/small-vehicles1.jpeg",
    detection_model,
    slice_width=200,
    slice_height=200,
    overlap_width_ratio=0.1,
    overlap_height_ratio=0.1,
)

results.export_visuals(export_dir="sahi-predict/")

print(f"탐지 수 : {len(results.object_prediction_list)}")
print("모든 코드가 성공적으로 수행됐습니다.")
