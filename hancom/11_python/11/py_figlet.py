import pyfiglet


def good_sentence(sentence: str) -> None:
    """입력된 문자열을 pyfiglet 형식으로 출력합니다.

    Args:
        sentence (str): 출력할 문자열

    Returns:
        None: 출력만 수행
    """
    py_sentence = pyfiglet.figlet_format(sentence)
    print(py_sentence)


good_sentence("GOOD")
