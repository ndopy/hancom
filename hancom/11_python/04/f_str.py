# 기존 방식 vs f-string
name = "King"
age = 99
# print("저는", name, "입니다. 나이는", age, "살입니다.")
# print(f"저는 {name}입니다. 나이는 {age}살입니다.")

# 표현식 삽입 및 포맷 지정
a = 5
b = 3
# print(f"{a} + {b} = {a + b}")
print(f"소수점 2자리 : {3.14159:.2f}")  # 3.14

# .format() 방식 : { } 자리에 순서대로 채움.
print("저는 {}입니다. 나이는 {}살입니다.".format(name, age))
