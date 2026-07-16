# 주석 : Ctrl(Command) + "/"
# 9가지 변수 타입
x = 10  # int
y = 3.14  # float
name = "Python"  # str
is_fun = True  # bool
colors = ["red", "green", "blue"]  # list
coords = (10, 20)  # tuple (순서 있음, 수정 불가)
person = {"name": "Tom", "age": 30}  # dict
nums = {1, 2, 3}  # set (중복 불가, 순서 없음)
nothing = None  # NoneType

# 파이썬 네이밍 컨벤션
# snake_case => 변수명 또는 함수명에 사용
# PascalCase => 클래스명에 사용
# camelCase => 파이썬에서는 권장하지 않음.

# 타입 확인하는 방법
# print(type(coords))      # <class 'tuple'>
print(isinstance(x, int))  # True
