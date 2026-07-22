import urllib.request
import json
import pandas
import os
from dotenv import load_dotenv

load_dotenv()

# 인증 키 설정
API_KEY = os.environ["API_KEY"]

# 도로 유형 지정
TYPE_ITS = "its"  # 국도

# 관심 지역 설정
MIN_X = float(120.95)  # 최소 경도
MAX_X = float(127.02)  # 최대 경도
MIN_Y = float(30.55)  # 최소 위도
MAX_Y = float(37.69)  # 최대 위도

# 응답 데이터 형식 설정
GET_TYPE = "json"

# API 요청 URL 생성
API_ENDPOINT = (
    f"https://openapi.its.go.kr:9443/cctvInfo"
    f"?apiKey={API_KEY}&type={TYPE_ITS}&cctvType=1"
    f"&minX={MIN_X}&maxX={MAX_X}"
    f"&minY={MIN_Y}&maxY={MAX_Y}"
    f"&getType={GET_TYPE}"
)


def its_cctv(cctv_index=77):
    # API 요청 및 응답 받기
    response = urllib.request.urlopen(API_ENDPOINT)

    # 응답 데이터 디코딩 : bytes => str (읽을 수 있는 문자로)
    json_str = response.read().decode("utf-8")

    # JSON 문자열을 파이썬 딕셔너리로 변환
    json_object = json.loads(json_str)

    # .json 확장자로 저장하기
    with open("cctv_data.json", "w", encoding="utf-8") as f:
        json.dump(json_object, f, ensure_ascii=False, indent=2)

    # 데이터프레임 변환
    cctv_play = pandas.json_normalize(json_object["response"]["data"])

    # .csv 파일로 저장하기
    cctv_play.to_csv("cctv_data.csv", index=False, encoding="utf-8-sig")

    # 특정 CCTV 선택
    cctv_url = cctv_play["cctvurl"][cctv_index]

    return cctv_url

