# 오늘 학습한 내용

## YOLO Advanced — solutions API와 SAHI를 활용한 응용 기능 실습

오늘은 `ultralytics`의 `solutions` 모듈과 SAHI(Slicing Aided Hyper Inference) 라이브러리를 활용해  
YOLO 탐지 결과에 다양한 분석 기능을 얹는 실습을 진행했다.

---

### 실습 환경 및 패키지 버전

| 패키지 | 버전 |
|---|---|
| Python | 3.9 (conda env `py39`) |
| ultralytics | 8.4.102 |
| sahi | 0.12.2 |
| opencv-python | 4.10.0.84 |
| torch | 2.2.2 |
| torchvision | 0.17.2 |
| numpy | 1.26.4 |

SAHI는 오늘 새로 설치했다.  
기존 `py39` conda 환경에 추가할 때 주의할 점이 있다.

```bash
pip install sahi
```

SAHI 설치 시 numpy와 opencv-python을 최신 버전으로 자동 업그레이드한다.

```
Successfully installed numpy-2.0.2 opencv-python-5.0.0.93 sahi-0.12.2
```

이 경우 PyTorch 등 다른 패키지와 충돌이 발생할 수 있으므로,  
설치 후 두 패키지를 모두 다운그레이드해야 한다.

```bash
pip install "numpy<2.0.0" "opencv-python==4.10.0.84"
```

---

### ultralytics solutions API

`solutions`는 Ultralytics가 제공하는 고수준 API로,  
탐지 루프를 직접 짜지 않고도 특정 목적(카운팅, 속도, 히트맵 등)에 맞는 기능을 바로 쓸 수 있다.  
공통 패턴은 아래와 같다.

```python
from ultralytics import solutions

obj = solutions.SomeSolution(model="yolo11n.pt", show=False, ...)

while cap.isOpened():
    success, frame = cap.read()
    results = obj(frame)          # 인스턴스를 직접 호출
    annotated = results.plot_im   # SolutionResults 객체에서 이미지 꺼내기
```

반환값이 `SolutionResults`이므로 일반 YOLO 추론(`results[0].plot()`)과 인터페이스가 다르다.

---

#### ObjectCounter — 선 기반 진입/이탈 카운팅 (`yolo_in_out.py`)

특정 선(두 좌표)을 기준으로 객체가 넘어갈 때 IN/OUT을 센다.

```python
count_points = [(203, 318), (468, 318)]
counter = solutions.ObjectCounter(model="yolo11n.pt", show=False, region=count_points)

results = counter(resized_frame)
cv2.imshow("IN_OUT", results.plot_im)
```

좌표는 `yolo_get_region.py`의 마우스 콜백으로 미리 찍어두고 복사해 쓰는 흐름이다.

---

#### RegionCounter — 다각형 구역 내 객체 수 집계 (`yolo_region.py`)

사각형(또는 다각형) 영역 안에 있는 객체 수를 프레임마다 집계한다.  
좌표는 **좌상단에서 시작해 반시계 방향**으로 지정해야 한다.

```python
region_points = {"region-01": [(13, 14), (15, 461), (610, 449), (617, 18)]}
yolo_region = solutions.RegionCounter(model="yolo11n.pt", show=False, region=region_points, conf=0.1)
```

---

#### DistanceCalculation — 두 객체 간 픽셀 거리 측정 (`yolo_distance.py`, `yolo_distance_t.py`)

화면에서 클릭한 두 객체의 바운딩박스 중심점 사이의 픽셀 거리를 계산한다.  
`yolo_distance_t.py`에서는 픽셀 거리를 가져와 직접 임계값 기반 상태 분류를 추가했다.

```python
distance = solutions.DistanceCalculation(model="yolo11n.pt", show=True)
results = distance.process(frame)
pixel_distance = results.pixels_distance

if pixel_distance >= 150:
    status = "SAFE"
elif pixel_distance >= 100:
    status = "WARNING"
else:
    status = "DANGER"
```

---

#### SpeedEstimator — 객체 속도 추정 (`yolo_speed.py`)

추적 궤적과 `meter_per_pixel` 보정값을 이용해 실시간 속도(km/h)를 추정한다.  
`meter_per_pixel`은 카메라 설치 환경에 따라 직접 보정해야 하는 값이다.

```python
yolo_speed = solutions.SpeedEstimator(
    model="yolo11n.pt",
    show=True,
    classes=[2],        # 차량만
    max_speed=120,      # 이 값을 초과하면 표시 안 됨
    meter_per_pixel=0.5
)
```

---

#### Heatmap — 이동 경로 누적 히트맵 (`yolo_heatmap.py`)

객체가 지나간 위치를 누적해 열지도(heatmap) 형태로 시각화한다.  
`colormap`으로 색상 팔레트를 지정할 수 있다.

```python
heatmap = solutions.Heatmap(model="yolo11n.pt", show=False, colormap=cv2.COLORMAP_MAGMA)
results = heatmap(frame)
annotated_frame = results.plot_im
```

---

#### ObjectBlurrer — 탐지 객체 블러 처리 (`yolo_blur.py`)

탐지된 모든 객체 영역에 블러를 씌운다.  
프라이버시 보호(얼굴·번호판 가리기) 등에 활용할 수 있다.

```python
blurrer = solutions.ObjectBlurrer(model="yolo11n.pt", show=False, blur_ratio=0.5)
results = blurrer(frame)
```

---

#### SecurityAlarm — 보안 감시 + 이메일 알림 (`yolo_alarm.py`)

설정한 클래스의 객체가 `records`회 이상 감지되면 이메일을 자동 발송한다.  
Gmail 앱 비밀번호로 SMTP 인증 후 사용한다.

```python
google_alarm = solutions.SecurityAlarm(
    model="yolo11n.pt",
    show=False,
    records=2,     # N회 감지 시 메일 1회 발송
    classes=[2],   # 2 = 자동차
)
google_alarm.authenticate(from_email, password, to_email)
results = google_alarm(frame)
```

---

### 좌표 수집 유틸: yolo_get_region.py

RegionCounter나 ObjectCounter에 쓸 좌표를 직접 마우스로 클릭해서 수집하는 보조 스크립트다.  
`cv2.setMouseCallback`으로 좌클릭 이벤트를 잡아 터미널에 좌표를 출력한다.

```python
def mouse_callback(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        points.append((x, y))
        print(f"클릭된 좌표 : {x}, {y}")

cv2.namedWindow("GET_X_Y", cv2.WINDOW_NORMAL)
cv2.setMouseCallback("GET_X_Y", mouse_callback)
```

---

### FastSAM — 텍스트 프롬프트 기반 세그멘테이션 (`yolo_fast_sam.py`)

FastSAM은 SAM(Segment Anything Model)의 경량화 버전으로,  
텍스트로 "어떤 것을 분리할지" 지정할 수 있다.

```python
from ultralytics import FastSAM

model = FastSAM("FastSAM-s.pt")
results = model(source, texts="dog")   # texts= 로 타겟 지정
output_image = results[0].plot()
cv2.imwrite("output_result.jpg", output_image)
```

---

### SAHI 실습 데이터 준비 (`10-yolo_sahi.py`)

SAHI에서 제공하는 `download_from_url`로 테스트 이미지를 내려받는다.

```python
from sahi.utils.file import download_from_url

download_from_url(
    "https://raw.githubusercontent.com/obss/sahi/main/demo/demo_data/small-vehicles1.jpeg",
    "demo_data/small-vehicles1.jpeg",
)
```

이 이미지는 멀리서 찍은 도로 위의 소형 차량들이 담긴 항공뷰 사진으로,  
일반 YOLO는 작아서 놓치는 차량이 많다는 것을 확인하는 데 쓴다.

---

### 기본 YOLO vs SAHI 비교 (`11-yolo_sahi_org.py`)

슬라이싱 없이 이미지를 통째로 넣었을 때의 탐지 수를 기록해두고,  
다음 단계(슬라이싱)와 숫자로 비교하기 위한 기준값을 만드는 코드다.

```python
from ultralytics import YOLO
import cv2, os

model = YOLO("yolo11n.pt")
results = model("demo_data/small-vehicles1.jpeg")

annotated_frame = results[0].plot()
os.makedirs("sahi", exist_ok=True)
cv2.imwrite("sahi/result_org.jpg", annotated_frame)

detected = len(results[0].boxes)
print(f"탐지 수: {detected}")
```

`results[0].boxes`의 길이로 탐지 수를 세고, 결과 이미지를 저장해 SAHI 슬라이싱 결과와 나란히 비교한다.

---

### SAHI — 슬라이싱 기반 소형 객체 탐지 (`12-yolo_sahi_slice.py`)

SAHI(Slicing Aided Hyper Inference)는 큰 이미지를 작은 조각으로 나눠 각각 탐지한 뒤 결과를 합치는 방식으로,  
멀리 있거나 작은 객체 탐지 성능을 높인다.

```python
from sahi import AutoDetectionModel
from sahi.predict import get_sliced_prediction

detection_model = AutoDetectionModel.from_pretrained(
    model_type="ultralytics", model_path="yolo11n.pt", confidence_threshold=0.4
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
```

슬라이스 크기(`slice_width`, `slice_height`)와 겹침 비율(`overlap_*_ratio`)을 조정해  
탐지 정밀도와 처리 속도를 트레이드오프할 수 있다.

---

### OpenVINO 모델 내보내기 + FPS 비교 (`16-yolo_export.py`, `17-yolo_compare.py`)

#### OpenVINO 형식으로 내보내기

`model.export`로 `.pt` 모델을 OpenVINO 형식으로 변환한다.  
변환하면 `yolo11n_openvino_model/` 폴더가 자동 생성된다.

```python
from ultralytics import YOLO

model = YOLO("yolo11n.pt")
model.export(format="openvino")
```

OpenVINO는 Intel CPU에서 추론 속도를 높이기 위한 최적화 포맷으로,  
별도의 GPU 없이도 더 빠른 추론이 가능하다.

#### FPS 측정으로 속도 비교

변환된 모델을 로드해 실제 추론 시간을 재고, FPS를 화면에 표시한다.

```python
import time
from ultralytics import YOLO

model = YOLO("yolo11n_openvino_model/")   # 변환된 모델 로드

start_time = time.perf_counter()
results = model(frame, verbose=False)
end_time = time.perf_counter()

fps = 1 / (end_time - start_time)

cv2.putText(annotated_frame, f"FPS: {fps:.1f}", (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
```

`time.perf_counter()`는 경과 시간 측정 전용 시계로,  
`time.time()`보다 정밀도가 높아 짧은 구간 벤치마킹에 적합하다.

---

### solutions 웹 UI (`18-yolo_search.py`, `19-yolo_streamlit.py`)

#### SearchApp — 이미지 시각 검색 웹앱

`solutions.SearchApp`은 이미지를 업로드하면 유사한 이미지를 찾아주는 웹 앱을 띄운다.

```python
from ultralytics import solutions

app = solutions.SearchApp(device="cpu")
app.run(debug=True)
```

실행하면 브라우저가 자동으로 열린다.

#### Inference — Streamlit 기반 추론 UI

`solutions.Inference`는 Streamlit 기반의 실시간 추론 인터페이스를 제공한다.  
파라미터 조정, 소스 선택 등을 웹 UI에서 바로 할 수 있다.

```python
from ultralytics import solutions

inf = solutions.Inference(model="yolo11n.pt")
inf.inference()
```

---

### 정리

- `ultralytics.solutions`는 탐지 루프를 직접 짜지 않아도 되는 고수준 API다.

- 반환값은 `SolutionResults` 객체이며, `results.plot_im`으로 시각화 이미지를 꺼낸다.

- 구역·선 기반 분석(카운팅, 구역 집계)은 먼저 좌표를 마우스 콜백으로 수집한 뒤 적용하는 흐름이 표준이다.

- FastSAM은 텍스트로 세그멘테이션 타겟을 지정할 수 있어, 클래스 ID를 몰라도 쓸 수 있다.

- SAHI는 이미지를 슬라이스 단위로 나눠 탐지하므로, 표준 YOLO가 놓치는 소형 객체 검출에 유리하다.

- SAHI 설치 시 numpy와 opencv-python이 자동 업그레이드되므로, 설치 후 반드시 두 패키지를 다운그레이드해야 한다.

- `model.export(format="openvino")`로 모델을 변환하면 Intel CPU 환경에서 추론 속도를 높일 수 있다.

- `time.perf_counter()`는 짧은 구간 시간 측정에 `time.time()`보다 정밀도가 높다.

- `solutions.SearchApp`과 `solutions.Inference`는 각각 시각 검색과 실시간 추론을 웹 UI로 바로 쓸 수 있게 해준다.
