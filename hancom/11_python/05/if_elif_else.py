is_raining = True  # 비가 오는가?

if is_raining:
    print("우산을 챙기세요!")
else:
    print("우산 없어도 돼요!")

temperature = 28  # 오늘 기온

if temperature >= 30:
    print("더워요! 반팔을 입으세요.")
elif temperature >= 20:
    print("딱 좋아요. 가볍게 입으세요.")
elif temperature >= 10:
    print("쌀쌀해요. 겉옷을 챙기세요.")
else:
    print("추워요! 두꺼운 코트를 입으세요.")
