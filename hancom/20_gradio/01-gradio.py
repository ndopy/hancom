import gradio as gr


def say_hello(name: str) -> str:
    """
    이름을 받아 인사말 문자열을 반환한다.

    Args:
        name: 이름

    Returns:
        "Hello, 이름"
    """
    return f"Hello, {name}"


# Gradio 인터페이스 생성
gr_web = gr.Interface(
    fn=say_hello,
    inputs="text",
    outputs="text",
)

# 웹앱 실행
gr_web.launch(share=True)  # share=True -> 공개 URL
