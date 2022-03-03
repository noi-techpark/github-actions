#!/bin/sh
set -euxo pipefail

python3 /webcompstore-cli.py --secret $1 --push $2