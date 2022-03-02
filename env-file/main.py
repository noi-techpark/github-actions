import os
import shutil

env_keys = list(dict(os.environ).keys())

prefix = str(os.environ.get("INPUT_ENVIRONMENT-VARIABLE-PREFIX", "X_"))
output = ""

for key in env_keys:
    if key.startswith(prefix):
        output += key.split(prefix, 1)[1] + "=" + os.environ.get(key) + "\n"

directory = os.environ.get("INPUT_WORKING-DIRECTORY", ".")
source_file = os.environ.get("INPUT_SOURCE-FILE")
destination_file = os.environ.get("INPUT_DESTINATION-FILE", ".env")

directory_str = str(directory)
source_file_str = str(source_file)
destination_file_str = str(destination_file)

if source_file is not None:
    shutil.copyfile(os.path.join(directory_str, source_file_str), os.path.join(directory_str, destination_file_str))

with open(os.path.join(directory_str, destination_file_str), "a") as text_file:
    text_file.write(output)
