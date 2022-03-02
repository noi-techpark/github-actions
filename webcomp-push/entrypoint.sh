#!/bin/sh
set -euxo pipefail

echo -n $1 >> .env

python3 /webcompstore-cli.py --push $2
