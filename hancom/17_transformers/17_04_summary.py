from transformers import pipeline

summarizer = pipeline("summarization", model="t5-small")

text = """
Global technology companies are entering
a new phase of competition that extends
far beyond software and chips. In recent weeks,
major AI labs have raced to secure computing power,
energy supplies, and government partnerships as demand
for artificial intelligence infrastructure accelerates.
Regulators in the United States and Europe are moving t
oward new rules on how powerful AI models can be released
and monitored, while countries in Asia continue to invest heavily
in domestic chip production to reduce reliance on foreign suppliers.
At the same time, cybersecurity researchers have raised alarms about
AI systems being used to launch increasingly sophisticated and
adaptive cyberattacks. Analysts say the convergence of these
trends—capital, energy, regulation, and security—marks
a turning point where the biggest questions in tech are no longer
about which company builds the best product,
but about who controls the underlying infrastructure and rules
that will shape the next decade.
"""

summary = summarizer(
    text,
    min_length=50,  # 최소 토큰 수 : 너무 짧은 요약 방지
    max_length=150,  # 최대 토큰 수 : 길이 폭주 방지
    do_sample=False,  # 결정적(greedy) 생성 -> 매번 동일 결과
)

# 반환 : [{"summary_text": str}] 리스트
sum_text = summary[0]["summary_text"]
print(f"요약된 문장 : {sum_text}")
