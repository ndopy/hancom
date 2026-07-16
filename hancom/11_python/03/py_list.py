# 리스트 : 순서가 있고, 수정이 가능하며, 중복을 허용하는 자료형이다.
colors = ["red", "green", "blue"]

# 인덱싱, 슬라이싱
# print(colors[0])  # red
# print(colors[-1])  # blue
# print(colors[0:2])  # ['red', 'green']

# 값 변경, 주요 메서드
# colors[-1] = "black"
# print(colors)

# colors.append("pink")
# print(colors)

# colors.insert(0, "white")
# print(colors)  # ['white', 'red', 'green', 'blue']

# colors.remove("red")
# print(colors)  # ['green', 'red']

numbers = [8, 5, 3, 2, 7]

# numbers.sort()  # 오름차순 정렬
# print(numbers)  # [2, 3, 5, 7, 8]

# numbers.sort(reverse=True)  # 내림차순 정렬
# print(numbers)  # [8, 7, 5, 3, 2]

# numbers.reverse()  # 순서 뒤집기
# print(numbers)  # [7, 2, 3, 5, 8]

print(2 in numbers)
