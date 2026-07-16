def meters_to_feet():
    user_input = input("미터 값을 입력해주세요 : ")

    try:
        meters = float(user_input)
        feet = meters * 3.28084
        print(f"{meters}m는 {feet:.2f}ft입니다.")
        return feet

    except ValueError:
        print("숫자를 입력해주세요.")


meters_to_feet()
