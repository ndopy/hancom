from termcolor import colored


def highlight(text, text_color, background_color) -> str:
    """
    Args:
      text: 텍스트
      text_color: 텍스트 색상
      background_color: 배경 색상

    Returns:
      텍스트 색상, 배경 색상을 적용한 새로운 텍스트
    """

    return colored(text, text_color, background_color, ["bold"])


message = highlight("중요 공지!", "yellow", "on_red")
print(message)
