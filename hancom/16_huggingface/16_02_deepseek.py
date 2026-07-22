from dotenv import load_dotenv
import os
from huggingface_hub import InferenceClient

load_dotenv()

client = InferenceClient(
    api_key=os.environ["HF_TOKEN"],
)

question = input("질문을 입력해주세요. : ")

completion = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V3.2:novita",
    messages=[{"role": "user", "content": question}],
)

print(completion.choices[0].message)
