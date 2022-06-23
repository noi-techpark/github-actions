#!/usr/bin/env python3

import os
import sys
from configobj import ConfigObj

env_keys = list(dict(os.environ).keys())

prefix = str(os.environ.get("INPUT_PROPERTIESFILE-ENVIRONMENT-VARIABLE-PREFIX", "PROPS_"))
path = sys.argv[1]

config = ConfigObj(path)

print(f"Creating / updating properties file at {path}")

for key in env_keys:
    if key.startswith(prefix):
       config[f"{key.split(prefix, 1)[1]}"] = os.environ.get(key)

print(config)
config.write()
