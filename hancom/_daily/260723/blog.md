# 오늘 학습한 내용

## 19 — Streamlit 실시간 CCTV 객체 탐지 대시보드

### st.empty()로 스트리밍 프레임 갱신

CCTV 영상을 `cv2.VideoCapture()`로 열고, 프레임마다 YOLO 탐지 결과를 화면에 그렸다.

```python
frame_placeholder = st.empty()

cap = cv2.VideoCapture(stream_url)
model = YOLO("yolo11n.pt")

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    results = model(frame)
    annotated_frame = results[0].plot()

    frame_placeholder.image(annotated_frame, channels="BGR")
```

`st.empty()`는 이후 내용으로 덮어쓸 수 있는 빈 자리를 만들어준다.  
반복문 안에서 `st.image()`를 그냥 호출하면 프레임마다 이미지 요소가 새로 쌓이지만, `frame_placeholder.image()`로 호출하면 같은 자리를 계속 갱신하는 방식이라 스트리밍처럼 보인다.  
OpenCV는 색상 채널 순서가 BGR이라 `channels="BGR"`을 명시해야 색이 뒤집히지 않는다.

### 화면 분할과 모델 캐싱

두 번째 실습에서는 영상과 그래프를 좌우로 나누고, 모델 로드를 캐싱했다.

```python
col1, col2 = st.columns(2)

with col1:
    frame_placeholder = st.empty()
with col2:
    chart_placeholder = st.empty()


@st.cache_resource
def load_model():
    return YOLO("yolo11n.pt")


model = load_model()
```

`st.columns(2)`는 같은 너비의 칸 2개를 만들어 레이아웃을 좌우로 나눈다.  
`@st.cache_resource`는 모델처럼 무거운 자원을 한 번만 로드하고 캐시에 저장해두는 데코레이터로, 이게 없으면 Streamlit의 재실행(rerun) 특성상 스크립트가 다시 실행될 때마다 모델을 매번 새로 불러오게 된다.

### Plotly로 탐지 객체 수 실시간 집계

탐지된 객체 클래스 이름을 모아서 종류별 개수를 막대그래프로 그렸다.

```python
labels = [model.names[int(c)] for c in results[0].boxes.cls]

df_count = pd.DataFrame({"Object": labels})
df_count = df_count.value_counts().reset_index(name="Count")

fig = px.bar(df_count, x="Object", y="Count", color="Object", text="Count")

chart_placeholder.plotly_chart(
    fig,
    width="stretch",
    key=f"chart_{time.time()}",
)
```

`value_counts()`로 같은 클래스가 몇 번 탐지됐는지 센 뒤 `px.bar()`로 바로 그래프를 그렸다.  
`key=f"chart_{time.time()}"`처럼 매 프레임마다 다른 key 값을 부여한 이유는, Streamlit이 같은 key를 가진 위젯을 재사용하려 하면서 충돌이 나는 걸 막기 위해서다.

### 정리

- `st.empty()`는 반복 갱신되는 자리(placeholder)를 만들어, 매번 새 요소를 쌓지 않고 같은 자리를 덮어쓰게 해준다.

- `@st.cache_resource`는 Streamlit이 스크립트를 재실행할 때마다 무거운 모델을 다시 로드하지 않도록 캐싱해주는 데코레이터다.

- 실시간으로 갱신되는 위젯에는 매번 고유한 `key`를 부여해야 위젯 충돌을 막을 수 있다.

---

## 20 — Gradio: Interface와 Blocks

### gr.Interface로 최소 예제 만들기

함수 하나만 있으면 입력/출력 폼을 자동으로 만들어주는 게 `gr.Interface`다.

```python
def say_hello(name: str) -> str:
    return f"Hello, {name}"

gr.Interface(fn=say_hello, inputs="text", outputs="text").launch(share=True)
```

`inputs`/`outputs`에 컴포넌트 타입을 문자열("text", "image" 등)로 지정하면 Gradio가 알아서 UI를 구성한다.  
`share=True`는 로컬 서버뿐 아니라 외부에서도 접속 가능한 임시 공개 URL을 함께 발급해준다.

### 번역 웹앱과 YOLO 탐지 웹앱

앞서 17_transformers·19_streamlit에서 썼던 `deep_translator`와 YOLO를 그대로 Gradio 인터페이스에 연결했다.

```python
def trans_en_to_ko(text):
    return GoogleTranslator(source="en", target="ko").translate(text)

gr.Interface(fn=trans_en_to_ko, inputs="text", outputs="text").launch(share=True)
```

```python
def det_image(image):
    results = model(image)
    return results[0].plot()

gr.Interface(
    fn=det_image,
    inputs=gr.Image(type="numpy"),
    outputs=gr.Image(),
).launch()
```

`gr.Image(type="numpy")`로 지정하면 업로드한 이미지가 OpenCV/YOLO가 바로 처리할 수 있는 numpy 배열 형태로 함수에 들어온다.

### gr.Blocks + gr.Tab으로 여러 기능 통합하기

`gr.Interface`는 함수 하나당 화면 하나지만, `gr.Blocks`를 쓰면 여러 컴포넌트와 함수를 원하는 레이아웃으로 직접 배치할 수 있다.  
앞서 만든 인사/번역/YOLO 탐지 함수 3개를 탭으로 묶어봤다.

```python
with gr.Blocks() as gr_web:
    gr.Markdown("# 내가 만든 AI 앱 모음")

    with gr.Tab("인사"):
        name_box = gr.Textbox(label="이름")
        hello_out = gr.Textbox(label="인사말")
        gr.Button("인사하기").click(say_hello, name_box, hello_out)

    with gr.Tab("번역"):
        en_box = gr.Textbox(label="영어")
        ko_box = gr.Textbox(label="한국어")
        gr.Button("번역하기").click(trans_en_to_ko, en_box, ko_box)

    with gr.Tab("YOLO 탐지"):
        img_in = gr.Image(type="numpy", label="사진 올리기")
        img_out = gr.Image(label="탐지 결과")
        gr.Button("탐지하기").click(det_image, img_in, img_out)

gr_web.launch(share=True)
```

`.click(함수, 입력_컴포넌트, 출력_컴포넌트)` 형태로 버튼 클릭 이벤트에 함수를 연결한다.  
함수 로직은 기존 `gr.Interface` 버전에서 그대로 재사용했고, 바뀐 건 UI를 조립하는 방식뿐이다.

### Interface와 Blocks의 차이

`gr.Interface`는 함수 하나 → 입력/출력 폼 하나를 자동으로 구성해주는 고수준 API라 빠른 프로토타입에 적합하다.  
`gr.Blocks`는 레이아웃(탭, 행/열, 버튼 클릭 이벤트 등)을 직접 조립하는 저수준 API라, 여러 기능을 한 화면에 묶거나 컴포넌트 간 상호작용을 세밀하게 제어할 때 필요하다.

### 정리

- `gr.Interface`는 함수 하나를 자동으로 웹 폼으로 감싸주는 방식이라 최소 예제를 빠르게 만들 때 적합하다.

- `gr.Blocks` + `gr.Tab`은 여러 함수를 하나의 앱 안에 탭으로 묶고, `.click()`으로 버튼과 함수를 직접 연결하는 방식이다.

- `gr.Image(type="numpy")`로 지정하면 업로드 이미지가 OpenCV/YOLO 등에서 바로 쓸 수 있는 numpy 배열로 전달된다.
