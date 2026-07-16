# zip() : 두 리스트 짝지어 묶기

names = ["철수", "영희", "민수"]
scores = [95, 88, 72]

# for name, score in zip(names, scores):
#     print(f"{name}: {score}점")

# 철수: 95점
# 영희: 88점
# 민수: 72점

# list()로 감싸면 튜플 리스트로 출력한다.
pairs = list(zip(names, scores))
print(pairs)
# [('철수', 95), ('영희', 88), ('민수', 72)]

keys = ["이름", "나이", "직업"]
values = ["홍길동", 30, "개발자"]

person = dict(zip(keys, values))
print(person)
# {'이름': '홍길동', '나이': 30, '직업': '개발자'}
