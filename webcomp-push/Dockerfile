FROM python:3.8-alpine

COPY entrypoint.sh /
COPY webcompstore-cli.py /
COPY requirements.txt /

RUN pip install --no-cache-dir -r requirements.txt


ENTRYPOINT ["/entrypoint.sh"]
