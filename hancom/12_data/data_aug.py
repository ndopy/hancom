from PIL import Image, ImageEnhance, ImageOps
import matplotlib.pyplot as plt

# 이미지 불러오기
img = Image.open("./captured_images/result_20260720_093442.jpg")
img = img.convert("RGB")

# 이미지 회전: 90도 = 반시계 방향
img_rotated = img.rotate(90)

# 밝기 조절: 0.5 = 원본의 50%
enhancer = ImageEnhance.Brightness(img)
img_brightness = enhancer.enhance(0.5)

# 좌우 반전
img_flipped = ImageOps.mirror(img)

fig, ax = plt.subplots(2, 3, figsize=(20, 10))

# 원본 이미지 넣기
ax[0, 0].imshow(img)
ax[0, 0].axis("off")
ax[0, 0].set_title("Original")

# 회전된 이미지 넣기
ax[0, 1].imshow(img_rotated)
ax[0, 1].axis("on")
ax[0, 1].set_title("Rotated 90")

# 밝기를 조절한 이미지 넣기
ax[0, 2].imshow(img_brightness)
ax[0, 2].axis("off")
ax[0, 2].set_title("Brightness 0.5")

# 좌우 반전된 이미지 넣기
ax[1, 0].imshow(img_flipped)
ax[1, 0].axis("off")
ax[1, 0].set_title("Flipped")

plt.show()

# 변형한 이미지 저장하기
img_rotated.save("./img_rotated.jpg")
img_brightness.save("./img_brightness.jpg")
img_flipped.save("./img_flipped.jpg")

print("이미지 저장이 완료되었습니다.")
