#!/bin/sh
set -euxo pipefail

python3 /webcompstore-cli.py --post $2
