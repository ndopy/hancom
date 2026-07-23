import gradio as gr
from deep_translator import GoogleTranslator


def trans_en_to_ko(text):
    translated = GoogleTranslator(source="en", target="ko").translate(text)

    return translated


# Gradio 인터페이스 생성
gr_web = gr.Interface(
    fn=trans_en_to_ko,
    inputs="text",
    outputs="text",
    title="Simple Translation Website",
    description="영어 문장을 입력하면 한국어로 번역됩니다",
)

# 웹앱 실행
gr_web.launch(share=True)  # share=True -> 공개 URL
