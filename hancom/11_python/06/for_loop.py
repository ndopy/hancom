mixed = [1, "hello", 3.14, True]

for item in mixed:
    print(item)

# 1
# hello
# 3.14
# True

for index, item in enumerate(mixed):
    print(f"index: {index}, item: {item}")

# index: 0, item: 1
# index: 1, item: hello
# index: 2, item: 3.14
# index: 3, item: True
