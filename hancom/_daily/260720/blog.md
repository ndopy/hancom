# 오늘 학습한 내용

## YOLO · 파인튜닝 · Roboflow 개념 정리

### YOLO란

YOLO(You Only Look Once)는 이미지에서 물체를 탐지하는 딥러닝 모델이다.  
"모델 구조(설계도) + 사전 학습된 가중치(weights)"로 이루어져 있다.

모델이 집 설계도라면, 가중치는 그 설계도로 지은 완성된 집에 해당한다.  
기본 모델은 COCO 데이터셋으로 사전 학습돼 있어서 별도 학습 없이 바로 쓸 수 있다.

```python
from ultralytics import YOLO

model = YOLO("yolo11n.pt")   # .pt 파일이 사전 학습된 가중치
results = model("사진.jpg")   # 바로 추론 가능
```

### COCO 데이터셋

COCO는 **Common Objects in Context**의 약자로, Microsoft가 만든 객체 탐지 벤치마크 데이터셋이다.  
사람이 직접 라벨링한 이미지 약 33만 장, 80가지 카테고리(사람·자동차·고양이 등)를 포함한다.

논문들이 "우리 모델이 COCO에서 mAP 몇 %"라는 방식으로 성능을 비교하면서,  
객체 탐지 분야의 공통 시험지로 자리 잡았다.

### 파인튜닝(Fine-tuning)

기본 모델은 COCO 80종을 인식하지만, 내 목적에 맞는 물체(예: 헬멧 착용 여부)를 탐지하려면 추가 학습이 필요하다.  
이 추가 학습 과정을 파인튜닝이라고 한다.

처음부터 학습시키면 수백만 장 + GPU 수백 시간이 필요하지만,  
파인튜닝은 이미 "물체를 보는 눈"이 갖춰진 상태에서 "어떤 물체인지 구분하는 기준"만 추가하는 것이라  
수천 장 + 몇 시간으로도 가능하다.

Ultralytics YOLO 라이브러리에는 학습·평가·추론 메서드가 내장돼 있어서 별도 구현 없이 쓸 수 있다.

```python
model = YOLO("yolo11n.pt")

model.train(data="data.yaml", epochs=50)  # 학습
model.val()                                # 성능 평가
model.predict("사진.jpg")                  # 추론
model.export(format="onnx")               # 포맷 변환
```

학습이 끝나면 결과가 자동으로 저장된다.

```
runs/detect/train/weights/best.pt   # 성능이 제일 좋았던 시점
runs/detect/train/weights/last.pt   # 마지막 epoch
```

나중에 내가 학습한 모델을 쓸 때는 `.pt` 경로만 바꿔서 로드하면 된다.

```python
my_model = YOLO("runs/detect/train/weights/best.pt")
```

### Roboflow

파인튜닝을 하려면 아래 과정이 필요하다.

1. 이미지 수집
2. 각 이미지에 "이게 헬멧이야" 박스 그리기 (라벨링)
3. YOLO가 읽을 수 있는 포맷으로 변환
4. `data.yaml` 생성

Roboflow는 이 중 ②③④를 웹 GUI로 처리해 주는 플랫폼이다.  
공개 데이터셋도 많아서 남이 이미 라벨링해 둔 데이터셋을 바로 다운받을 수도 있다.

Roboflow에서 받은 데이터셋 구조는 아래와 같고, `data.yaml`을 `model.train()`에 그대로 넘기면 된다.

```
dataset/
├── data.yaml
├── train/images/
├── train/labels/
├── valid/images/
└── valid/labels/
```

### 라벨링은 결국 사람 몫

라벨링 자동화 도구(Roboflow Auto-Label, Meta의 SAM 등)로 초안을 잡아줄 수는 있지만,  
최종 검수는 사람이 해야 한다.  
라벨 품질이 곧 모델 성능이고, 잘못된 라벨을 넣으면 잘못된 모델이 나온다(GIGO: Garbage In, Garbage Out).

### 정리

- YOLO = 모델 구조 + 사전 학습 가중치(`.pt`)
- 기본 모델(COCO 80종) → 내 데이터로 파인튜닝 → 특화 모델 — 이 흐름이 현업 표준

- Roboflow는 라벨링·포맷 변환·`data.yaml` 생성을 편하게 해주는 도구이고, YOLO와 묶인 필수 조합은 아님

- 학습 결과도 `.pt`로 저장되며, 기본 모델과 동일한 방식으로 로드해서 사용

---

## YOLO 기능별 태스크 실습

YOLO는 탐지 외에도 여러 태스크를 지원한다.  
사용할 태스크에 맞는 모델 파일(`.pt`)만 바꾸면 되고, 추론 코드 패턴(`results[0].plot()`)은 동일하다.

| 태스크 | 모델 파일 | 설명 |
|--------|-----------|------|
| 탐지(Detection) | `yolo26n.pt` | 바운딩 박스 + 클래스 레이블 |
| 분류(Classification) | `yolo26n-cls.pt` | 이미지 전체를 하나의 클래스로 분류 |
| 포즈 추정(Pose) | `yolo26n-pose.pt` | 사람의 keypoint(관절) 탐지 |
| 인스턴스 분할(Segmentation) | `yolo26n-seg.pt` | 박스 대신 픽셀 단위 마스크 |

---

## YOLO 모델 크기와 탐지 성능 실험

### classes 파라미터

특정 클래스만 탐지하고 싶을 때는 `classes` 파라미터에 클래스 번호 리스트를 넘긴다.

```python
model(
    "./input.jpg",
    save=True,
    classes=[60, 75],  # 60=dining table, 75=vase
)
```

클래스 번호는 `model.names`로 확인할 수 있다.  
COCO는 **0부터 시작하는 인덱스**를 사용하므로, 1-indexed로 넣으면 엉뚱한 클래스가 탐지된다.

```python
print(model.names)
# {0: 'person', 1: 'bicycle', ..., 60: 'dining table', 75: 'vase', ...}
```

### 모델 크기(n/s/m/l/x)에 따른 정확도 차이

같은 YOLO 버전 안에서도 모델 크기에 따라 정확도가 크게 달라진다.

| 크기 | 의미 | 특징 |
|------|------|------|
| n | nano | 가장 작고 빠름, 정확도 낮음 |
| s | small | n보다 정확도 높음 |
| m | medium | 균형 |
| l | large | 정확도 높음 |
| x | xlarge | 가장 정확, 가장 느림 |

세 모델로 같은 이미지(dining table + vase가 있는 사진)를 탐지해봤다.

| 모델 | dining table | vase |
|------|-------------|------|
| yolo11n | 0.40 | 0.47 |
| yolo26n | 미감지 | 0.63 |
| yolo26s | 0.37 | **0.90** |

**yolo11n**
![yolo11n 결과](../../13_yolo/runs/detect/predict-9-yolo11n/input_params.jpg)

**yolo26n**
![yolo26n 결과](../../13_yolo/runs/detect/predict-9-yolo26n/input_params.jpg)

**yolo26s**
![yolo26s 결과](../../13_yolo/runs/detect/predict-9-yolo26s/input_params.jpg)

- **yolo26n**: dining table을 아예 감지하지 못했다. 신뢰도가 기본 임계값(0.25) 미만으로 내려갔기 때문으로 추정.
- **yolo26s**: dining table은 yolo11n보다 소폭 낮지만(0.37 vs 0.40), vase에서 0.90으로 압도적으로 높은 신뢰도를 보였다.
- 최신 버전(26)이라도 nano 크기는 특정 클래스를 놓칠 수 있고, 클래스마다 모델별 성능 분포가 다르다는 것을 직접 확인한 케이스다.

### 정리

- **최신 모델 = 전 클래스에서 항상 더 잘함은 아니다.** 버전과 크기를 함께 봐야 한다.
- 실습·테스트 단계에서는 `s` 이상을 기본으로 쓰고, 속도가 중요한 환경(엣지 디바이스, 실시간 처리)에서만 `n`을 선택한다.
- 감지가 안 될 때는 `conf` 값을 낮춰서 확인해볼 것 — 인식은 하는데 신뢰도가 낮아서 걸러지는 경우도 있다.

---

## CCTV HLS 스트림 연결 트러블슈팅

### HLS란

HLS(HTTP Live Streaming)는 Apple이 만든 동영상 스트리밍 방식이다.  
영상을 통째로 전송하는 대신, 짧은 조각(보통 2~10초)으로 잘라서 순서대로 보낸다.

`.m3u8` 파일은 그 조각들의 재생 목록이고, 실제 영상 데이터는 `.ts` 파일들에 담긴다.

```
playlist.m3u8       ← "1번, 2번, 3번 조각 순서로 재생해"
  ├── segment001.ts ← 실제 영상 0~3초
  ├── segment002.ts ← 실제 영상 3~6초
  └── segment003.ts ← 실시간이면 계속 추가됨
```

일반 HTTP로 전송 가능해서 방화벽 제약이 없고, 네트워크 상태에 따라 화질을 자동으로 조절할 수 있어  
공공 CCTV, 유튜브 라이브, 트위치 등이 이 방식을 사용한다.

### 문제 상황

공공 CCTV의 HLS 스트림(`.m3u8`)을 OpenCV로 열려고 했을 때 아래 에러가 발생했다.

```
OpenCV: Couldn't read video stream from file "https://..."
```

웹 브라우저에서는 동영상이 정상적으로 재생되는데 코드에서만 실패하는 상황이었다.

### 원인 진단

```python
import cv2
info = cv2.getBuildInformation()
for line in info.split('\n'):
    if 'FFMPEG' in line or 'Video I/O' in line:
        print(line)
```

출력 결과:

```
  Video I/O:
    FFMPEG:                      NO
      avformat:                  NO
```

**OpenCV 5.0.0이 FFmpeg 없이 빌드된 버전**이었다.  
HLS(`.m3u8`)는 네트워크 스트림 프로토콜이라 FFmpeg 없이는 읽을 수 없다.

### 해결

OpenCV 5.x는 아직 개발 중이라 pip 빌드에 FFmpeg가 빠진 경우가 많다.  
안정 버전인 4.x로 다운그레이드하면 FFmpeg가 포함돼 있다.

```bash
pip uninstall opencv-python -y
pip install opencv-python==4.10.0.84
```

설치 후 동일한 코드(`cv2.VideoCapture(stream_url)`)가 정상 동작했다.

### 정리

- `cv2.getBuildInformation()`으로 FFMPEG 포함 여부를 먼저 확인한다.

- HLS(`.m3u8`) 스트림은 FFmpeg 없이 읽을 수 없다.

- pip의 OpenCV 5.x 빌드는 FFmpeg가 빠진 경우가 있으므로, 스트림 처리가 필요하면 4.x를 쓴다.

---

## 실시간 CCTV 탐지 — 객체 수 기반 경고 시스템

HLS 연결 문제를 해결한 뒤, 탐지된 객체 수에 따라 Safe/Warning을 판단하는 응용을 만들었다.

```python
count = len(results[0].boxes)  # 현재 프레임의 탐지 박스 개수

if count >= WARNING_THRESHOLD:
    status, color = "Warning", (0, 0, 255)
else:
    status, color = "Safe", (255, 0, 0)

cv2.putText(annotated_frame, f"Detected : {count}, {status}", (10, 30), ...)
```

`results[0].boxes`는 탐지된 박스 목록이므로 `len()`으로 개수를 바로 구할 수 있다.

---

## 객체 추적(Tracking)

탐지(Detection)는 매 프레임을 독립적으로 처리하지만, 추적(Tracking)은 동일 객체에 **일관된 ID**를 붙여 여러 프레임에 걸쳐 이어서 관찰한다.

```python
results = model.track(frame, persist=True, conf=0.6)
# persist=True: 이전 프레임 정보를 유지해 같은 객체에 같은 ID를 이어붙임
```

`model()` 대신 `model.track()`을 쓰고 `persist=True`를 주면 된다.  
내부적으로 ByteTrack 알고리즘이 동작한다.

---

## 카메라 캡처 · 이미지 데이터 증강

파인튜닝용 데이터를 직접 만드는 실습을 했다.  
OpenCV로 웹캠 이미지를 캡처하고, PIL로 증강한 뒤 저장하는 흐름이다.

```python
# 캡처
cap = cv2.VideoCapture(0)
success, frame = cap.read()
cv2.imwrite(f"./captured_images/result_{timestamp}.jpg", frame)
cap.release()

# 증강
img_rotated    = img.rotate(90)
img_brightness = ImageEnhance.Brightness(img).enhance(0.5)
img_flipped    = ImageOps.mirror(img)
```

실제 파인튜닝에서는 이렇게 증강한 이미지들을 원본에 섞어 학습 데이터를 늘리는 데 쓴다.

---

## 실습 환경

| 패키지 | 버전 |
|--------|------|
| Python | 3.9 (conda env: py39) |
| opencv-python | 4.10.0.84 |
| ultralytics | 8.4.102 |
| torch | 2.2.2 |
| torchvision | 0.17.2 |
| numpy | 1.26.4 |
