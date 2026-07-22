from dotenv import load_dotenv
import os
from huggingface_hub import InferenceClient

load_dotenv()

client = InferenceClient(
    # provider="fal-ai",
    provider="auto",
    api_key=os.environ["HF_TOKEN"],
)

question = input("생성할 이미지를 설명해주세요. : ")

# output is a PIL.Image object
image = client.text_to_image(
    question,
    model="black-forest-labs/FLUX.1-dev",
)

# 생성한 이미지 저장
image.save("./images/tti_result.jpg")

# 완료 메시지 출력
print("전체 코드가 잘 실행됐습니다.")
