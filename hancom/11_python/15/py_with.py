FILE = "memo.txt"
ENC = "utf-8"

with open(FILE, "w", encoding=ENC) as f:
    f.write("안녕, 파이썬!\n")
    f.write("with문이 파일을 자동으로 닫아줌\n")

with open(FILE, "r", encoding=ENC) as f:
    text = f.read()
    print(text)

with open(FILE, "a", encoding=ENC) as f:
    f.write("새로운 한 줄 추가\n")

with open(FILE, "r", encoding=ENC) as f:
    text = f.read()
    print(text)
