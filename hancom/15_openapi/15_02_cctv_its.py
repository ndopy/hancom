import urllib.request
import json
import pandas
from pprint import pprint
from dotenv import load_dotenv
import os

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

# API 요청 및 응답 받기
response = urllib.request.urlopen(API_ENDPOINT)
# pprint(response)

# 응답 데이터 디코딩 : bytes => str (읽을 수 있는 문자로)
json_str = response.read().decode("utf-8")
# pprint(json_str)

# JSON 문자열을 파이썬 딕셔너리로 변환
json_object = json.loads(json_str)
# pprint(json_object)

# 데이터프레임 변환
cctv_play = pandas.json_normalize(json_object["response"]["data"])

# 특정 CCTV 선택 : 77번 선택
test_url = cctv_play["cctvurl"][77]

pprint(f"선택된 CCTV URL : {test_url}")
# http://cctvsec.ktict.co.kr/4601/vl00x2wRMU4M9Nvr6NVRIz+aunfQEKGlepgqXLxBaDi7Rzmo0jApHqbI2RSxrBmT/XcCo8e8jGfEFVmG4poh585dQPhxzlrYg/HtIDDoR3I=
# 브라우저용 : http://cctvsec.ktict.co.kr/4601/vl00x2wRMU4M9Nvr6NVRIz+aunfQEKGlepgqXLxBaDi7Rzmo0jApHqbI2RSxrBmT/XcCo8e8jGfEFVmG4poh585dQPhxzlrYg/HtIDDoR3I=
