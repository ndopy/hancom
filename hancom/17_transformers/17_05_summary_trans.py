from transformers import pipeline
from deep_translator import GoogleTranslator


def translate_en_to_kr(sentence):
    """
    전달받은 영문을 한국어로 번역하는 함수
    """
    translated_sentences = GoogleTranslator(source="en", target="ko").translate(
        sentence
    )

    return translated_sentences


summarizer = pipeline("summarization", model="t5-small")

text = """
NewJeans' first group content in more than a year has fueled speculation about the group's return,
but Ador said Wednesday that no decisions have been made regarding future activities.
The agency released five videos on the group's official YouTube channel at midnight Wednesday to mark the fourth anniversary of NewJeans' debut — one featuring the group together and four individual videos.
The group video drew particular attention as it featured Minji, whose future with the agency had remained unclear.
"""

summary = summarizer(
    text,
    min_length=50,  # 최소 토큰 수 : 너무 짧은 요약 방지
    max_length=150,  # 최대 토큰 수 : 길이 폭주 방지
    do_sample=False,  # 결정적(greedy) 생성 -> 매번 동일 결과
)

# 반환 : [{"summary_text": str}] 리스트
sum_text = summary[0]["summary_text"]
print(f"요약된 영어 문장 : {sum_text}")

kr_sum_text = translate_en_to_kr(sum_text)
print(f"번역된 한국어 문장 : {kr_sum_text}")
