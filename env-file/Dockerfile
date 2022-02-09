FROM alpine:3.15

COPY entrypoint.sh /
COPY main.py /

RUN apk add python3

ENTRYPOINT ["/entrypoint.sh"]
