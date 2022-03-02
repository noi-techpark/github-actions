import os
import shutil

env_keys = list(dict(os.environ).keys())

prefix = str(os.environ.get("INPUT_ENVIRONMENT_VARIABLE_PREFIX", "X_"))
output = ""

for key in env_keys:
    if key.startswith(prefix):
        output += key.split(prefix, 1)[1] + "=" + os.environ.get(key) + "\n"

directory = os.environ.get("INPUT_WORKING_DIRECTORY", ".")
source_file = os.environ.get("INPUT_SOURCE_FILE")
destination_file = os.environ.get("INPUT_DESTINATION_FILE", ".env")

directory_str = str(directory)
source_file_str = str(source_file)
destination_file_str = str(destination_file)

print(directory)
print(directory_str)
print(source_file_str)
print(destination_file_str)

if source_file is not None:
    shutil.copyfile(os.path.join(directory_str, source_file_str), os.path.join(directory_str, destination_file_str))

with open(os.path.join(directory_str, destination_file_str), "a") as text_file:
    text_file.write(output)
