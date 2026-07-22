from transformers import pipeline

generator = pipeline(
    "text-generation",
    #  model="gpt2"
    model="skt/kogpt2-base-v2",
)

answer = input("생성 문장을 입력해주세요. : ")

result = generator(answer, max_new_tokens=50, num_return_sequences=1, truncation=True)

print(result[0]["generated_text"])
