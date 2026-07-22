# 오늘 학습한 내용

## 15 — ITS OpenAPI + YOLO 실시간 CCTV 탐지

### ITS OpenAPI로 CCTV 목록 수집

국토교통부에서 운영하는 ITS(Intelligent Transport Systems) OpenAPI를 사용해 도로 CCTV URL 목록을 수집했다.  
API 요청 URL은 경도/위도 범위와 도로 유형(국도 `its` / 고속도로 `ex`)을 파라미터로 받는다.

```python
API_ENDPOINT = (
    f"https://openapi.its.go.kr:9443/cctvInfo"
    f"?apiKey={API_KEY}&type={TYPE_ITS}&cctvType=1"
    f"&minX={MIN_X}&maxX={MAX_X}"
    f"&minY={MIN_Y}&maxY={MAX_Y}"
    f"&getType={GET_TYPE}"
)
```

응답은 JSON으로 받아 `pandas.json_normalize()`로 DataFrame 변환 후 CSV/JSON으로 저장했다.

```python
response = urllib.request.urlopen(API_ENDPOINT)
json_str = response.read().decode("utf-8")
json_object = json.loads(json_str)

cctv_play = pandas.json_normalize(json_object["response"]["data"])
cctv_play.to_csv("cctv_data.csv", index=False, encoding="utf-8-sig")
```

`json_normalize()`는 중첩된 딕셔너리를 평탄하게 펼쳐서 DataFrame으로 만들어주는 함수다.  
JSON 안에 배열이나 중첩 객체가 있어도 열(column)로 전개해준다.

### YOLO 실시간 탐지 연동

수집한 CCTV URL을 `cv2.VideoCapture()`에 직접 넘겨 실시간 스트리밍 프레임을 가져오고, YOLO로 추론했다.

```python
cap = cv2.VideoCapture(cctv_url)
model = YOLO("yolo11n.pt")

while cap.isOpened():
    success, frame = cap.read()
    results = model(frame)
    annotated_frame = results[0].plot()
    cv2.imshow("ITS_YOLO", annotated_frame)
```

CCTV URL을 그대로 VideoCapture에 연결하면 실제 도로 상황을 YOLOv11이 실시간 탐지한다.

---

## 16 — HuggingFace InferenceClient

HuggingFace Hub에서 제공하는 `InferenceClient`를 사용해 외부 모델 API를 직접 호출했다.  
직접 모델을 로컬에 내려받지 않고 클라우드에 올라간 모델에 요청만 보내는 방식이다.

### DeepSeek 텍스트 생성

```python
from huggingface_hub import InferenceClient

client = InferenceClient(api_key=os.environ["HF_TOKEN"])

completion = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V3.2:novita",
    messages=[{"role": "user", "content": question}],
)
print(completion.choices[0].message)
```

`OpenAI SDK`와 인터페이스가 동일하다(`chat.completions.create` 방식).  
모델 ID에 `:novita`처럼 콜론 뒤에 provider를 붙이면 특정 추론 제공사를 지정할 수 있다.

### FLUX.1-dev 텍스트→이미지 생성

```python
image = client.text_to_image(
    question,
    model="black-forest-labs/FLUX.1-dev",
)
image.save("./images/tti_result.jpg")
```

반환값이 `PIL.Image` 객체라서 `.save()`로 바로 파일 저장이 가능하다.  
`provider="auto"`로 설정하면 HuggingFace가 가용한 추론 공급자를 자동으로 선택한다.

---

## 17 — Sentence Transformers 문장 유사도

### 개념: 임베딩과 코사인 유사도

`sentence_transformers`는 문장을 숫자 벡터(임베딩)로 변환해준다.  
이 벡터 간의 방향 차이를 코사인 유사도로 측정하면 두 문장이 의미적으로 얼마나 가까운지 수치로 나온다.

- `-1` : 완전히 반대 의미
- `0` : 의미 무관
- `1` : 완전히 동일 의미

### 실습 코드

```python
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

sen1 = "He is reading a book in the library"
sen2 = "He is at the library reading a book"

emb1 = model.encode(sen1, convert_to_tensor=True)
emb2 = model.encode(sen2, convert_to_tensor=True)

cos_sim = util.pytorch_cos_sim(emb1, emb2)
print(f"두 문장의 유사도 : {cos_sim.item():.4f}")
# 출력: 두 문장의 유사도 : 0.9723
```

어순만 다르고 내용이 같은 두 문장이 `0.9723`으로 거의 동일한 의미로 판정됐다.

### 환경 호환성 이슈 및 해결

실행 시 두 가지 에러가 동시에 발생했다.

#### 문제 1 — NumPy 버전 충돌

```
A module that was compiled using NumPy 1.x cannot be run in NumPy 2.2.6
```

PyTorch 2.2.2는 NumPy 1.x 기준으로 빌드됐는데, 환경에 NumPy 2.2.6이 설치돼 있어 런타임에 충돌이 났다.

**해결:**
```bash
pip install "numpy<2.0"
```

#### 문제 2 — transformers 라이브러리의 PyTorch 버전 요구사항

```
[transformers] Disabling PyTorch because PyTorch >= 2.4 is required but found 2.2.2
```

`transformers` 라이브러리 최신 버전이 내부적으로 PyTorch >= 2.4를 요구하도록 업데이트됐다.  
PyTorch를 비활성화해버리기 때문에 이후 `sentence_transformers`의 모델 로드가 실패한다.

**해결:**
```bash
pip install "transformers<4.44"
```

#### 왜 PyTorch를 업그레이드하지 않았나

`pip install torch --upgrade`를 실행했지만 2.2.2에서 더 올라가지 않았다.  
원인은 **Intel Mac (x86_64)** 환경이기 때문이다.

- (추론) PyTorch는 2.3 이후 Intel Mac용 공식 바이너리 배포를 중단한 것으로 알려져 있다.
- 확인된 사실: 이 환경의 pip에서 조회되는 torch 최신 버전이 2.2.2로 막혀 있다.
- 공식 확인: [pytorch.org/get-started/previous-versions/](https://pytorch.org/get-started/previous-versions/)

#### 최종 호환 조합 (Intel Mac 기준)

| 패키지 | 버전 조건 |
|---|---|
| torch | 2.2.2 (최대) |
| numpy | `< 2.0` |
| transformers | `< 4.44` |

### 정리

- 문장 임베딩: 문장 → 숫자 벡터 (방향이 의미를 담음)
- 코사인 유사도: 벡터 간 각도로 의미 유사도를 측정 (-1 ~ 1)

- Intel Mac 환경에서 `sentence_transformers` 실행 시 NumPy와 transformers 버전을 함께 내려야 한다.

- `numpy < 2.0`, `transformers < 4.44` 조합으로 PyTorch 2.2.2와 정상 동작 확인.

---

## 17 — 감정 분석 (Sentiment Analysis)

### pipeline으로 감정 분석하기

`transformers`의 `pipeline()`은 태스크 이름만 넘기면 적합한 모델을 자동으로 선택해서 로드해준다.

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
```

기본 모델(`distilbert-base-uncased-finetuned-sst-2-english`)은 **POSITIVE / NEGATIVE** 두 클래스만 분류한다.

### 기본 모델의 한계 — NEUTRAL 없음

"좋지도 싫지도 않다"는 중립적인 문장을 넣었더니 NEGATIVE로 분류됐다.

```python
text = "I didn't like or dislike lunch today."
# 결과: NEGATIVE 0.9755
```

확인된 사실: 기본 모델 실행 결과에서 NEUTRAL 레이블이 나오지 않았다.  
(추론) 기본 모델이 두 클래스만 갖고 있어서 중립 문장도 억지로 둘 중 하나로 분류하는 것으로 보인다.

### 3-클래스 모델로 교체

`cardiffnlp/twitter-roberta-base-sentiment-latest` 모델은 POSITIVE / NEUTRAL / NEGATIVE 세 클래스를 지원한다.  
`pipeline()`의 `model` 파라미터에 모델 ID를 넘기면 된다.

```python
classifier = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)
```

### 테스트 결과

| 문장 | 결과 | 점수 |
|---|---|---|
| "I'm feeling really great today" | POSITIVE | 0.9968 |
| "I'm having a hard time today" | NEGATIVE | 0.9967 |
| "I didn't like or dislike lunch today." | NEGATIVE | 0.8732 |
| "I went to the store today." | NEUTRAL | 0.6349 |

"I didn't like or dislike"는 중립 의도로 쓴 문장이지만 NEGATIVE로 분류됐다.  
`didn't like`라는 부정어가 포함돼 있어 모델이 부정적으로 읽은 것으로 보인다. (추론)

감정 분석 모델은 단어 패턴에 민감하기 때문에, 작성자의 의도와 모델의 분류 결과가 다를 수 있다.

### 정리

- `pipeline("sentiment-analysis")`의 기본 모델은 POSITIVE/NEGATIVE만 분류한다.

- NEUTRAL이 필요하면 3-클래스 모델(`cardiffnlp/twitter-roberta-base-sentiment-latest`)을 명시적으로 지정해야 한다.

- 모델은 의도가 아니라 단어 패턴을 보기 때문에, 중립 의도 문장도 포함된 단어에 따라 다르게 분류될 수 있다.

---

## 17 — 텍스트 생성 (Text Generation)

### GPT-2로 영어 문장 생성

`pipeline("text-generation")`에 모델을 지정하면 입력 문장을 이어서 생성해준다.

```python
from transformers import pipeline

generator = pipeline("text-generation", model="gpt2")
result = generator(answer, max_new_tokens=50, num_return_sequences=1, truncation=True)
print(result[0]["generated_text"])
```

주의: 파라미터 이름은 `max_new_tokens`(s 포함)가 맞다. `max_new_token`으로 쓰면 무시되거나 경고가 발생한다.

### 한국어 모델로 교체 — skt/kogpt2-base-v2

GPT-2는 영어 데이터로 학습됐기 때문에 한국어 입력을 제대로 처리하지 못한다.  
한국어 텍스트 생성을 위해 SK Telecom이 공개한 `skt/kogpt2-base-v2` 모델로 교체했다.

```python
generator = pipeline(
    "text-generation",
    model="skt/kogpt2-base-v2",
)
```

모델 ID만 바꾸면 나머지 코드는 동일하게 동작한다.

### 정리

- `pipeline("text-generation")`은 입력 문장을 이어 완성하는 태스크다.

- 기본 `gpt2`는 영어 전용이므로, 한국어 생성이 필요하면 한국어 사전학습 모델(`skt/kogpt2-base-v2` 등)을 명시적으로 지정해야 한다.

---

## 17 — 텍스트 요약 (Summarization)

### t5-small로 문서 요약하기

`pipeline("summarization")`에 `t5-small` 모델을 지정해 긴 영어 기사를 요약했다.

```python
summarizer = pipeline("summarization", model="t5-small")

summary = summarizer(
    text,
    min_length=20,   # 출력 최소 토큰 수 — 너무 짧은 요약 방지
    max_length=60,   # 출력 최대 토큰 수 — 길이 폭주 방지
    do_sample=False, # greedy 생성 → 매번 동일한 결과
)
sum_text = summary[0]["summary_text"]
```

반환값은 `[{"summary_text": str}]` 형태의 리스트다.

### t5-small 모델 특징

T5는 Google Research가 2020년 발표한 인코더-디코더 구조 모델로, 모든 NLP 태스크를 "텍스트 입력 → 텍스트 출력" 형식으로 통일해서 처리한다.  
`t5-small`은 파라미터 수 약 6,000만 개(60M)로 T5 계열 중 가장 작은 변형이다.

### 실행 결과와 한계

요약 결과:
```
global technology companies are entering a new phase of competition
that extends beyond software and chips. the convergence of these
trends—capital, energy, regulation, and security—marks a turning point
where the biggest questions in tech are no longer about which company
builds the best product.
```

원문의 핵심 흐름(AI 인프라 경쟁, 규제 움직임, 아시아 칩 투자, 사이버보안 위협)은 빠지고, 첫 문장과 마지막 결론 문장만 남았다.  
실질적으로 요약이라기보다 원문에서 문장을 추출한 수준이다.

### min_length / max_length는 내용이 아닌 길이만 제어한다

`min_length`와 `max_length`를 수정해도 요약 결과가 비슷하게 나온다.  
이 두 파라미터는 **출력 토큰 수의 범위만** 결정할 뿐, 어떤 내용을 선택할지는 모델 가중치가 결정하기 때문이다.

- `min_length` / `max_length` → 출력 길이 범위
- 어떤 내용을 포함할지 → 모델이 결정, 파라미터로 바꿀 수 없음

`do_sample=False`(greedy) 설정이면 동일한 입력에 항상 동일한 결과가 나온다.

### 정리

- `t5-small`은 학습 목적에는 충분하지만, 긴 문서에서 중간 내용을 요약하는 능력은 제한적이다.

- 요약 품질을 높이려면 요약 태스크에 파인튜닝된 더 큰 모델(`facebook/bart-large-cnn` 등)을 사용하는 것이 낫다.

- `min_length` / `max_length`는 길이 제어 파라미터이고, 요약 품질은 모델 자체가 결정한다.

---

## 17 — 요약 결과 한국어 번역 (deep_translator)

### 요약 → 번역 파이프라인

`t5-small`로 요약한 영어 결과물을 `deep_translator`의 `GoogleTranslator`로 한국어로 번역했다.

```python
from deep_translator import GoogleTranslator

def translate_en_to_kr(sentence):
    translated_sentences = GoogleTranslator(source="en", target="ko").translate(sentence)
    return translated_sentences
```

`GoogleTranslator`는 Google 번역 API를 내부적으로 호출한다.  
`source`와 `target`에 언어 코드를 지정하면 되고, `.translate()`에 문자열을 넘기면 번역 결과 문자열을 반환한다.

### 사용 흐름

```python
summarizer = pipeline("summarization", model="t5-small")

summary = summarizer(text, min_length=50, max_length=150, do_sample=False)
sum_text = summary[0]["summary_text"]
print(f"요약된 영어 문장 : {sum_text}")

kr_sum_text = translate_en_to_kr(sum_text)
print(f"번역된 한국어 문장 : {kr_sum_text}")
```

t5-small이 영어로 요약한 결과를 바로 번역 함수에 넘기는 구조다.  
모델 자체가 한국어 요약을 지원하지 않으므로, 요약 → 번역을 순서대로 연결하는 방식으로 한국어 결과를 얻는다.

### 정리

- `deep_translator`의 `GoogleTranslator`는 `source`/`target` 언어 코드와 `.translate()` 호출만으로 번역할 수 있다.

- 한국어를 직접 요약하는 모델이 없을 때 "영어 요약 → 한국어 번역" 순서로 연결하면 결과를 얻을 수 있다.

- 번역 품질은 Google 번역 수준이므로, 자연스러운 한국어가 필요하면 한국어 요약 파인튜닝 모델을 탐색하는 것이 낫다.

---

## 18 — OCR (Tesseract + pytesseract)

### Tesseract 설치

OCR 실습에서 사용하는 Tesseract는 Python 패키지가 아니라 시스템 레벨 바이너리다.  
Homebrew로 설치하며, 가상환경 활성화 여부와 무관하게 동작한다.

```bash
brew install tesseract
brew install tesseract-lang  # 한국어 등 추가 언어팩
```

Python에서 쓰는 `pytesseract`는 Tesseract를 감싼 래퍼 패키지이므로, 가상환경 안에서 따로 설치한다.

```bash
pip install pytesseract pillow
```

### pytesseract 경로 설정

`pytesseract`는 실제 OCR을 Tesseract 바이너리에 위임한다.  
Python이 바이너리 위치를 못 찾는 경우를 방지하기 위해 경로를 명시적으로 지정한다.

```python
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"/usr/local/bin/tesseract"
```

Intel Mac 기준 경로는 `/usr/local/bin/tesseract`다.  
`which tesseract`로 확인하면 확실하다.

경로 앞의 `r`은 raw string 표시로, 백슬래시를 이스케이프 문자로 해석하지 말라는 뜻이다.  
macOS는 경로 구분자가 `/`이므로 사실 `r`이 없어도 동일하게 동작한다. Windows 코드와 호환성을 맞추는 관행으로 붙인다.

### 영어 / 한국어 OCR

`image_to_string()`의 `lang` 파라미터로 언어를 지정한다.

```python
results = pytesseract.image_to_string(image, lang="eng")      # 영어
results = pytesseract.image_to_string(image, lang="kor")      # 한국어
results = pytesseract.image_to_string(image, lang="eng+kor")  # 혼용
```

### 전처리 시도와 Tesseract 한계

한글 기사 이미지를 OCR한 결과, 글자 사이에 공백이 끼어드는 오인식이 지속됐다.

```
오 픈 시 는 'GPT-5.6 솔 ...
```

이진화(binarization) 전처리와 PSM 모드 조정을 시도했으나 결과는 거의 동일하거나 오히려 나빠졌다.

```python
import cv2
from PIL import Image

img = cv2.imread("./images/article-ko.png")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
image = Image.fromarray(binary)

config = '--psm 6'
results = pytesseract.image_to_string(image, lang="eng+kor", config=config)
```

PSM 모드는 텍스트 레이아웃 해석 방식을 바꾸는 것이지, 낱자 분리 오인식 자체를 수정하지 않는다.  
Tesseract의 한글 언어팩은 영어에 비해 자간 인식이 약해서, 이 문제는 구조적 한계에 가깝다.

### 정리

- `brew install tesseract`로 시스템 바이너리 설치 → `pip install pytesseract`로 Python 래퍼 설치.

- `pytesseract.pytesseract.tesseract_cmd`로 바이너리 경로를 명시하면 경로 오류를 방지할 수 있다.

- 한글 인식은 `lang="kor"` 또는 `lang="eng+kor"`로 지정한다.

- Tesseract는 영어 인식에는 준수하지만, 한글 낱자 분리 오인식이 빈번하다. 한글 문서 실무에서는 EasyOCR이나 Google Vision API를 선택하는 것이 일반적이다.
