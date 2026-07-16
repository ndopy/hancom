import pyfiglet
from termcolor import colored

py_text = pyfiglet.figlet_format("Hello")

# color_text = colored(py_text, "blue")
color_text = colored(py_text, "white", "on_yellow")

print(color_text)
