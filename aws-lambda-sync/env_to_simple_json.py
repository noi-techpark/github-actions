#!/usr/bin/env python3

# SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
#
# SPDX-License-Identifier: AGPL-3.0-or-later

import os

env_keys = list(dict(os.environ).keys())

prefix = str(os.environ.get("INPUT_LAMBDA-ENVIRONMENT-VARIABLE-PREFIX", "LAMBDA_"))
output = []

for key in env_keys:
    if key.startswith(prefix):
        output.append(f"{key.split(prefix, 1)[1]}={os.environ.get(key)}")

print(f'{{{",".join(output)}}}')
