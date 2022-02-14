FROM alpine:3.15

COPY entrypoint.sh /

RUN apk update && \
  apk add --no-cache ca-certificates \
  openssh-client \
  bash \
  ansible

ENTRYPOINT ["/entrypoint.sh"]
