# 오늘 학습한 내용

## Python 변수 타입과 네이밍 컨벤션

### 9가지 기본 타입

```python
x       = 10              # int
y       = 3.14            # float
name    = "Python"        # str
is_fun  = True            # bool
colors  = ["red", "green"] # list — 순서 있음, 수정 가능, 중복 허용
coords  = (10, 20)        # tuple — 순서 있음, 수정 불가
person  = {"name": "Tom"} # dict — 키-값 쌍
nums    = {1, 2, 3}       # set — 중복 불가, 순서 없음
nothing = None            # NoneType
```

### 타입 확인

```python
print(type(x))           # <class 'int'>
print(isinstance(x, int)) # True
```

`type()`은 타입 자체를 반환하고, `isinstance()`는 해당 타입인지 불리언으로 반환한다.

### 네이밍 컨벤션

| 방식 | 사용 대상 |
|---|---|
| `snake_case` | 변수명, 함수명 |
| `PascalCase` | 클래스명 |
| `camelCase` | Python에서 권장하지 않음 |

JS에서는 변수·함수에 `camelCase`를 쓰지만, Python에서는 `snake_case`가 표준이다.

---

## Python 연산자

### 문자열 연산

Python에서 문자열에 `*` 연산자를 쓰면 반복된다.

```python
a = "hello"
print(a + " world")  # hello world
print(a * 2)         # hellohello
```

### 복합 대입 연산자

JS와 동일하게 `+=`, `-=`, `*=`, `/=` 등을 지원한다.

```python
score = 0
score += 10  # 10
score -= 3   # 7
score *= 2   # 14
score /= 2   # 7.0  — 나눗셈 결과는 항상 float
```

JS와 다른 점: Python의 `/=`는 항상 `float`를 반환한다.  
정수 나눗셈을 유지하려면 `//=`를 쓴다.

---

## Python 리스트 복사 — 얕은 복사 vs 깊은 복사

Python에서 리스트를 복사하는 방법은 여러 가지가 있다.  
단, 대부분의 방법은 **얕은 복사(shallow copy)** 라는 공통점이 있다.

### 얕은 복사 방법

```python
colors = ["red", "green", "blue"]

copy1 = colors[0:len(colors)]  # 슬라이싱 — 동작하지만 장황함
copy2 = colors[:]              # 슬라이싱 관용 표현
copy3 = colors.copy()          # 메서드 방식
```

세 가지 모두 새 리스트 객체를 만들지만, 내부 요소는 원본과 같은 객체를 참조한다.

```python
copy2 is colors        # False — 다른 리스트 객체
copy2[0] is colors[0]  # True  — 요소는 같은 객체
```

문자열·숫자처럼 불변(immutable) 요소만 담겨 있다면 실질적으로 문제없다.  
리스트 안에 리스트가 중첩된 구조일 때 얕은 복사가 함정이 된다.

### 깊은 복사 (deepcopy)

완전히 독립된 복사본이 필요하면 `copy` 모듈의 `deepcopy`를 쓴다.

```python
import copy

nested = [[1, 2], [3, 4]]

shallow = nested.copy()
deep = copy.deepcopy(nested)

nested[0][0] = 99

print(shallow[0][0])  # 99 — 원본의 영향을 받음
print(deep[0][0])     # 1  — 완전히 독립된 복사본
```

중첩 구조가 없으면 얕은 복사로 충분하고, 중첩이 있고 원본과 완전히 분리해야 할 때만 `deepcopy`를 쓴다.

---

## Python 자료형의 값 저장 방식 — JS와 비교

Python의 값 저장 방식은 JavaScript와 큰 그림이 같다.

| JavaScript | Python |
|---|---|
| 원시값 (number, string, boolean…) | 불변(immutable) — int, float, str, tuple |
| 객체·배열 (참조 타입) | 가변(mutable) — list, dict, set |

```python
# 불변 — JS 원시값처럼 재바인딩해도 원본에 영향 없음
a = 10
b = a
b = 99
print(a)  # 10

# 가변 — JS 객체처럼 참조를 공유
x = [1, 2, 3]
y = x
y.append(99)
print(x)  # [1, 2, 3, 99] — 원본도 바뀜
```

### JS와 한 가지 차이

JS는 원시값과 객체를 타입 자체로 구분하지만, Python은 **"모든 것이 객체"** 다.  
`int`도 내부적으로는 객체이고, 불변이기 때문에 JS 원시값처럼 동작하는 것이다.  
실습 수준에서는 "불변 = JS 원시값, 가변 = JS 객체"로 읽으면 충분하다.

---

## 리스트 정렬과 뒤집기 — 원본 변경 vs 새 값 반환

`.sort()`와 `.reverse()`는 **원본을 직접 변경(in-place)** 하고 `None`을 반환한다.

```python
colors = ["red", "green", "blue"]

colors.sort()
print(colors)  # ['blue', 'green', 'red']

colors.reverse()
print(colors)  # ['red', 'green', 'blue']
```

원본을 유지하고 싶으면 내장 함수 버전을 쓴다.

```python
colors = ["red", "green", "blue"]

sorted_colors   = sorted(colors)          # 새 리스트 반환
reversed_colors = list(reversed(colors))  # 새 리스트 반환

print(colors)         # ['red', 'green', 'blue'] — 원본 그대로
print(sorted_colors)  # ['blue', 'green', 'red']
```

| 메서드·함수 | 원본 변경 | 반환값 |
|---|---|---|
| `.sort()` | O | `None` |
| `.reverse()` | O | `None` |
| `sorted()` | X | 새 리스트 |
| `reversed()` | X | 이터레이터 (list()로 감싸야 함) |

---

## zip() — 두 리스트 짝지어 묶기

`zip()`은 두 리스트를 인덱스 순서대로 쌍으로 묶어준다.

```python
names  = ["철수", "영희", "민수"]
scores = [95, 88, 72]

for name, score in zip(names, scores):
    print(f"{name}: {score}점")
```

`list()`로 감싸면 결과를 리스트로 받을 수 있다.

```python
pairs = list(zip(names, scores))
# [('철수', 95), ('영희', 88), ('민수', 72)]
```

### 왜 튜플 리스트로 반환하나

`zip()`이 만든 쌍은 "이 두 값은 한 세트"라는 고정된 구조이므로 불변인 튜플이 적합하다.  
수정할 이유가 없는 쌍을 불변으로 잠가두는 것이 의도에 맞고, 튜플이 리스트보다 메모리도 덜 쓴다.  
(단, "왜 튜플이냐"에 대한 Python 공식 설계 문서는 없으며 이는 추론이다.)

`dict(zip(keys, values))`처럼 딕셔너리 생성에도 자주 쓰인다.

```python
keys   = ["이름", "나이", "직업"]
values = ["홍길동", 30, "개발자"]

person = dict(zip(keys, values))
# {'이름': '홍길동', '나이': 30, '직업': '개발자'}
```

---

## print()의 sep과 f-string

### print()가 자동으로 공백을 넣는 이유

```python
name = "King"
age = 99

print("저는", name, "입니다. 나이는", age, "살입니다.")
# 출력: 저는 King 입니다. 나이는 99 살입니다.
```

`name`과 `age` 사이에 띄어쓰기를 하지 않았는데도 공백이 들어간다.  
`print()`의 시그니처를 보면 이유를 알 수 있다.

```python
print(*objects, sep=' ', end='\n')
```

`sep`의 기본값이 `' '`(공백 한 칸)이라서, 쉼표로 구분된 인자들 사이에 자동으로 공백이 들어간다.

```python
print("A", "B", "C")           # A B C
print("A", "B", "C", sep="")   # ABC
print("A", "B", "C", sep="-")  # A-B-C
```

JS의 `console.log()`도 내부적으로는 같은 동작을 하는데, JS에서는 보통 `"문자열 " + 변수` 형태로 이어붙여서 인자를 하나만 넘기다 보니 눈에 잘 안 띄었던 것이다.

### f-string을 쓰면 sep 문제가 없다

f-string은 `print()`에 인자를 하나만 넘기는 것이라 `sep`이 개입할 여지가 없다.  
원하는 위치에만 정확히 공백을 배치할 수 있어서, Python 문자열 출력은 f-string을 기본으로 쓰는 게 편하다.

```python
print(f"저는 {name}입니다. 나이는 {age}살입니다.")
# 출력: 저는 King입니다. 나이는 99살입니다.
```

---

---

## for 반복문과 enumerate

### enumerate는 언제 쓰나

순회하면서 **인덱스도 함께 필요할 때** 씁니다.  
이름 그대로 "번호를 붙여 열거(enumerate)한다"는 뜻이다.

```python
mixed = [1, "hello", 3.14, True]

# 인덱스 필요 없으면 그냥 for
for item in mixed:
    print(item)

# 인덱스도 필요하면 enumerate
for index, item in enumerate(mixed):
    print(f"{index}번째: {item}")
```

JS의 `for...of`가 값만 순회하는 것처럼, Python의 기본 `for item in list`도 인덱스를 노출하지 않는다.  
인덱스가 필요할 때 `enumerate`를 쓰는 것이 Python다운 방식이다.

### range(len()) — 안티패턴인 이유

JS의 `for (let i = 0; i < arr.length; i++)` 스타일을 Python으로 옮기면 `range(len())`이 된다.

```python
# 가능은 하지만 안티패턴
for i in range(len(mixed)):
    print(mixed[i])  # i가 없어도 되는데 인덱스를 경유함

# Pythonic
for item in mixed:
    print(item)
```

안티패턴으로 보는 이유는 **더 나은 도구(`enumerate`, `for item in`)가 있는데 굳이 인덱스를 경유하기 때문**이다.  
Python 2.3에 `enumerate`가 추가된 이유 자체가 이 패턴을 대체하기 위해서였고, Ruff 같은 린터도 `consider-using-enumerate` 경고를 띄운다.

### 간격이 있는 인덱스 순회 — range의 step

0, 2, 4처럼 특정 간격으로만 순회할 때는 `range(start, stop, step)`을 쓴다.  
이 경우는 인덱스 간격 자체가 목적이므로 `range(len())`이 적합한 도구다 — 안티패턴이 아니다.

```python
# 짝수 인덱스만 (0, 2, 4...)
for i in range(0, len(mixed), 2):
    print(mixed[i])

# 홀수 인덱스만 (1, 3, 5...)
for i in range(1, len(mixed), 2):
    print(mixed[i])
```

`enumerate` 안에서 조건문을 거는 방식도 동작은 하지만, 건너뛸 항목도 모두 순회하므로 비효율적이다.

정리하면:
- 값이 중심, 인덱스는 부가 정보 → `enumerate`
- 인덱스 간격·범위가 핵심 → `range(start, stop, step)`

### Pythonic 코드란

**"Python이 제공하는 도구를 그 의도대로 쓴 코드"** 를 Pythonic하다고 말한다.  
Python의 설계 철학은 `import this`로 확인할 수 있는 **The Zen of Python**에 명문화되어 있다.

```
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Readability counts.
```

핵심은 두 가지다.

**① 언어가 제공하는 관용 표현을 쓴다**

```python
# Not Pythonic
i = 0
while i < len(mixed):
    print(mixed[i])
    i += 1

# Pythonic
for item in mixed:
    print(item)
```

**② 의도가 코드에 직접 드러난다**

```python
# Not Pythonic
if len(colors) == 0:
    print("비어 있음")

# Pythonic — 빈 리스트는 falsy
if not colors:
    print("비어 있음")
```

JS로 비유하면 `arr.includes()`가 있는데 직접 루프로 찾는 것, `for...of` 대신 인덱스 루프만 쓰는 것과 비슷한 느낌이다.

---

---

## Python docstring

함수에 `"""..."""`으로 설명을 붙이는 것을 docstring이라고 한다.  
VS Code에서 함수에 마우스를 올리면 hover tooltip으로 표시된다.

### PEP 257 구조 규칙 (공식 문서, 2024-04-17 최종 업데이트)

요약 문장을 `"""` 바로 뒤에 쓰고, 빈 줄 이후에 상세 내용을 붙인다.

```python
def good_sentence(sentence: str) -> None:
    """입력된 문자열을 pyfiglet 형식으로 출력합니다.

    매개변수 sentence(str)를 받아 pyfiglet으로 변환 후 출력만 수행하며 반환값은 없다.
    """
```

### Google 스타일 docstring (PEP 257과 별개인 컨벤션)

`Args:` / `Returns:` 섹션 형식은 PEP 257이 아니라 Google이 만든 스타일 가이드다.  
Pylance가 이 키워드를 인식해 섹션별로 구분해 렌더링해주며, 실무에서도 많이 쓰인다.

```python
def good_sentence(sentence: str) -> None:
    """입력된 문자열을 pyfiglet 형식으로 출력합니다.

    Args:
        sentence (str): 출력할 문자열

    Returns:
        None: 출력만 수행
    """
```

### 형식이 중요한 이유

VS Code hover는 docstring을 마크다운으로 렌더링한다.  
마크다운에서는 줄바꿈 하나가 단락 구분이 아니므로, 항목 사이에 빈 줄이 없으면 한 줄로 뭉쳐서 보인다.

또한 `"""` 바로 뒤가 빈 줄이면 Pylance가 요약을 인식하지 못해 전체를 압축해 표시한다.  
요약은 반드시 `"""` 바로 다음 줄에 써야 한다.

---

## with open() — 파일 입출력

Python에서 파일을 다룰 때는 `with` 문을 쓴다.  
블록이 끝나면 자동으로 파일을 닫아주기 때문에 `close()`를 직접 호출할 필요가 없다.

```python
# 쓰기 (w: 덮어쓰기)
with open("memo.txt", "w", encoding="utf-8") as f:
    f.write("안녕, 파이썬!\n")

# 읽기 (r)
with open("memo.txt", "r", encoding="utf-8") as f:
    print(f.read())

# 추가 (a: 기존 내용 유지하고 이어쓰기)
with open("memo.txt", "a", encoding="utf-8") as f:
    f.write("새로운 한 줄 추가\n")
```

파일 경로와 인코딩이 반복될 때는 변수로 빼면 관리가 편하다.

```python
FILE = "memo.txt"
ENC  = "utf-8"

with open(FILE, "w", encoding=ENC) as f:
    f.write("안녕, 파이썬!\n")
```

---

## lambda — 이름 없는 함수

`lambda`는 이름 없이 짧은 함수를 만드는 문법이다.  
JS의 화살표 함수(`=>`)와 거의 같은 역할이다.

| | Python | JavaScript |
|---|---|---|
| 기본 형태 | `lambda x: x * 2` | `x => x * 2` |
| 여러 인자 | `lambda a, b: a + b` | `(a, b) => a + b` |
| 콜백으로 바로 넘기기 | `sort(key=lambda x: -x)` | `sort((a, b) => b - a)` |

차이점: JS 화살표 함수는 여러 줄 바디(`{}`)를 쓸 수 있지만, Python 람다는 **표현식 하나만** 가능하다.

### 언제 쓰나

이름 없이 딱 한 번만 쓸 때 자연스럽다.  
`sort(key=)`처럼 콜백으로 바로 넘기는 경우가 대표적이다.

```python
numbers = [3, 1, 4, 1, 5]
numbers.sort(key=lambda x: -x)  # 내림차순 정렬
```

### Ruff 경고 — E731

변수에 람다를 할당하면 Ruff가 경고를 띄운다.

```python
# E731 경고
add = lambda a, b: a + b

# 권장 방식
def add(a, b):
    return a + b
```

"변수에 담아 이름을 붙일 거라면 `def`를 써라"는 PEP 8의 원칙이다.  
람다를 변수에 담으면 디버깅 시 함수 이름이 `<lambda>`로 나와 추적이 어려워지는 문제도 있다.  
**"람다 자체를 쓰지 마라"가 아니라 "변수에 할당하지 마라"** 가 정확한 의미다.

---

## pyfiglet + termcolor — 터미널 환경에 따른 색상 차이

`pyfiglet`로 ASCII 아트 텍스트를 만들고 `termcolor`로 색상을 입히는 실습을 했다.

```python
import pyfiglet
from termcolor import colored

py_text = pyfiglet.figlet_format("Hello")
color_text = colored(py_text, "blue", "on_yellow", ["bold"])
print(color_text)
```

### 주의: 터미널 환경에 따라 색상이 다르게 보인다

`termcolor`는 ANSI 이스케이프 코드로 색상을 출력하는데, 이 코드를 어떻게 렌더링할지는 **터미널 에뮬레이터가 결정**한다.  
같은 코드라도 환경마다 결과가 다를 수 있다.

| 환경 | 동작 |
|---|---|
| iTerm2 | ANSI 색상 정상 렌더링 |
| VS Code 내장 터미널 | 색상이 의도와 다르게 나오거나 일부 무시됨 |

VS Code 내장 터미널은 xterm.js라는 자체 터미널 에뮬레이터를 사용하고,  
VS Code의 색상 테마가 ANSI 팔레트를 덮어쓰기 때문에 `termcolor` 출력이 의도대로 안 나올 수 있다.

### VS Code에서 iTerm2를 외부 터미널로 연결하는 방법

VS Code 내장 터미널을 iTerm2로 교체하는 것은 불가능하다.  
대신 `settings.json`에 아래 설정을 추가하면 `Shift + Cmd + C`로 현재 폴더를 iTerm2에서 열 수 있다.

```json
"terminal.external.osxExec": "iTerm.app"
```

색상 출력이 중요한 코드는 이 방법으로 iTerm2에서 직접 실행해서 확인한다.

---

### 정리

- 리스트 복사는 `[:]` 또는 `.copy()` — 둘 다 얕은 복사, 중첩 구조엔 `deepcopy` 사용.
- Python의 불변/가변 구분은 JS의 원시값/참조 타입 구분과 동작이 같다.
- `.sort()` / `.reverse()`는 원본 변경, `sorted()` / `reversed()`는 원본 유지.
- `print()`의 `sep` 기본값은 `' '` — 인자 사이에 자동 공백이 들어감. f-string으로 회피.
- 인덱스 없이 값만 순회 → `for item in`, 인덱스도 필요 → `enumerate`, 간격 순회 → `range(start, stop, step)`.
- Pythonic = Python이 제공하는 도구를 의도대로 쓴 코드. 의도가 코드에 직접 드러나야 한다.
- `termcolor` 등 ANSI 색상 출력은 터미널 환경에 따라 다르게 보임 — VS Code 내장 터미널보다 iTerm2에서 확인할 것.
- `zip()`은 두 리스트를 튜플 쌍으로 묶음 — `dict(zip(keys, values))`로 딕셔너리 생성에도 활용.
- `with open()`은 블록 종료 시 파일 자동 닫기 — 모드 `w`(덮어쓰기), `r`(읽기), `a`(이어쓰기).
- `lambda`는 JS 화살표 함수와 유사 — 변수에 할당하지 말고 콜백으로 바로 넘길 때만 쓸 것(Ruff E731).
- Python 네이밍: 변수·함수는 `snake_case`, 클래스는 `PascalCase`, `camelCase`는 비권장.
- 문자열 `*` 연산자로 반복 가능 (`"hello" * 2 = "hellohello"`). `/=`는 항상 float 반환.
