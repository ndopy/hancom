from sentence_transformers import SentenceTransformer, util

# 사전 학습된 모델 로드
model = SentenceTransformer("all-MiniLM-L6-v2")
"""
all-MiniLM-L6-v2 모델 설명
- 가벼운 6레이어 트랜스포머, 384차원 벡터 출력
- 영어 문장을 의미 공간에 매핑 (방향이 곧 의미)
- 특징
  1. 빠른 연산 속도 (CPU, 모바일 가능)
  2. 의미 보존력 우수 (어순 변화에 강건)
  3. 검색,추천,중복 탐지, 클러스터링에 표준 모델

- 벡터 : 문장을 숫자로 나열 (컴퓨터는 문자를 이해할 수 없으므로)
- 임베딩 : 문장이나 단어를 숫자 좌표로 변환하는 것
"""

# 비교할 두 문장 정의 : 유사도 = 0.9723
sen1 = "He is reading a book in the library"
sen2 = "He is at the library reading a book"

# 의미가 다른 두 문장 : 유사도 = 0.0208
# sen1 = "The cat is sleeping on the sofa"
# sen2 = "Tomorrow, I have a math exam at school"

# 문장을 모델이 이해할 수 있도록 벡터로 변환하기
emb1 = model.encode(sen1, convert_to_tensor=True)
emb2 = model.encode(sen2, convert_to_tensor=True)

# 코사인 유사도 계산
cos_sim = util.pytorch_cos_sim(emb1, emb2)

# 결과 출력
print(f"두 문장의 유사도 : {cos_sim.item():.4f}")

# 값 범위 해석
# -1 : 완전히 반대 의미
#  0 : 의미 무관
#  1 : 완전한 동일 의미
