from ultralytics import solutions

# 검색 앱 생성 - CPU에서 동작
app = solutions.SearchApp(device="cpu")

# 웹 서버 실행 -> 브라우저로 자동 오픈된다.
app.run(debug=True)
