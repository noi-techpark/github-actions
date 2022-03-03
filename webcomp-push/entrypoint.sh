#!/bin/sh
set -euxo pipefail

echo -n $1 >> .env

sh .env.sh

python3 /webcompstore-cli.py --post $2
