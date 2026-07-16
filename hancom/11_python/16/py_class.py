# =====
# 1. 클래스 : 제품의 설계도
# 2. 생성자 : 객체를 만들 때 실행되는 함수
# 3. 속성 : 클래스 안에 있는 변수
# 4: 메서드 : 클래스 안에 정의된 함수
# 5. 객체 : 설계도로 만든 제품
# =====

# 클래스 정의
class World:
    # 생성자
    def __init__(self, name):
        self.name = name

    def hello(self):
        print(f"Hello, {self.name}!")

    def we_are(self):
        print(f"We are the {self.name}")


# 객체 생성
asia = World("Korea")
asia.we_are()
