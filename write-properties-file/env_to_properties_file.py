#!/usr/bin/env python3

# SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
#
# SPDX-License-Identifier: AGPL-3.0-or-later

import os
import sys
from configobj import ConfigObj

env_keys = list(dict(os.environ).keys())

prefix = sys.argv[1]
path = sys.argv[2]

config = ConfigObj(path)

print(f"Creating / updating properties file at {path}")

for key in env_keys:
    if key.startswith(prefix):
       config[f"{key.split(prefix, 1)[1]}"] = os.environ.get(key)

config.write()
