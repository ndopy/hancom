import pytesseract
from PIL import Image

# Tesseract 실행 파일 경로 지정
pytesseract.pytesseract.tesseract_cmd = r"/usr/local/bin/tesseract"

# 이미지 불러오기
# image = Image.open("./images/tesseract.png")
image = Image.open("./images/article-en.png")

# OCR 수행
results = pytesseract.image_to_string(image, lang="eng+kor")

# 결과 출력
print(results)
