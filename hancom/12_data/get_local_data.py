import cv2  # 카메라를 다루는 도구
import os  # 운영체제와 상호 작용하는 도구
from datetime import datetime  # 날짜 및 시간을 다루는 도구

# 1. 사진을 저장할 폴더 준비
save_dir = "./captured_images"
os.makedirs(
    save_dir,
    exist_ok=True,
    # exist_ok : 지정한 경로에 폴더가 이미 존재할 때 발생하는 에러(FileExistsError) 무시
    # = 폴더가 없을 때는 새로 생성하고, 이미 있을 때는 기존 폴더를 유지한다.
)

# 2. 카메라 켜기
cap = cv2.VideoCapture(0)  # 0 = 현재 디바이스의 첫 번째 카메라

# 카메라가 노출을 안정화할 시간을 주기 (30프레임 버리기)
for _ in range(30):
    cap.read()

# 3. 사진을 한 장 찍기
success, frame = cap.read()  # success=True면 성공, frame=촬영된 이미지

if success:
    # 사진 파일명을 '촬영된 시간'으로 사용
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")  # ex. 20260720_091847

    file_path = os.path.join(save_dir, f"result_{timestamp}.jpg")

    cv2.imwrite(file_path, frame)
    print(f"사진이 저장되었습니다. : {file_path}")
else:
    print("카메라를 찾을 수 없습니다.")

# 4. 카메라 끄기 (사용 후 반드시 해제)
cap.release()
