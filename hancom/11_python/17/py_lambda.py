import pyfiglet

# add = lambda a, b: a + b
# print(add(7, 3))


# def decorate_text(text):
#     return pyfiglet.figlet_format(text)


decorate_text = lambda text: pyfiglet.figlet_format(text)
py_text = decorate_text("Lambda")
print(py_text)
