from transformers import pipeline
# pipeline : 텍스트, 이미지 등 다양한 AI 태스크를 쉽게 실행할 수 있는 도구

# 감정 분석 파이프라인 생성
classifier = pipeline(
    "sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)

# 감정 분석할 문장 입력
# text = "I'm felling really great today"
# 감정 분석 결과 : POSITIVE
# 감정 분석 점수 : 0.9968

# text = "I'm having a hard time today"
# 감정 분석 결과 : NEGATIVE
# 감정 분석 점수 : 0.9967

text = "I went to the store today"
# 감정 분석 결과 : neutral
# 감정 분석 점수 : 0.6349

results = classifier(text)

# 결과 확인
print(f"감정 분석 결과 : {results[0]['label']}")
print(f"감정 분석 점수 : {results[0]['score']:.4f}")
