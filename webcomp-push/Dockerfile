FROM python:3.8-alpine

RUN apk add --no-cache wget

RUN wget "https://raw.githubusercontent.com/noi-techpark/it.bz.opendatahub.webcomponents/main/webcompstore-cli/webcompstore-cli.py"
RUN wget "https://raw.githubusercontent.com/noi-techpark/it.bz.opendatahub.webcomponents/main/webcompstore-cli/requirements.txt"

COPY entrypoint.sh /

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["/entrypoint.sh"]
