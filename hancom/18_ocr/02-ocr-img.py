import pytesseract
from PIL import Image
import cv2

# 전처리로 이미지 품질 올리기
img = cv2.imread("./images/article-ko.png")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # 흑백 변환
_, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)  # 이진화
image = Image.fromarray(binary)

# Tesseract 실행 파일 경로 지정
pytesseract.pytesseract.tesseract_cmd = r"/usr/local/bin/tesseract"

# Tesseract PSM 모드 조정
config = "--psm 6"  # 6 = 균일한 텍스트 블록으로 간주

# OCR 수행
results = pytesseract.image_to_string(image, lang="eng+kor", config=config)

# 결과 출력
print(results)
