FROM node:16-alpine

RUN apk add --no-cache wget

RUN mkdir /validator
RUN wget "https://webcomponents.opendatahub.com/validator/validator.js" -P /validator

RUN mkdir /schemas
RUN wget "https://webcomponents.opendatahub.com/schemas/wcs-manifest-schema.json" -P /schemas

RUN sed -i "s/import.*from.*\.json'/& assert { type: 'json' }/" /validator/validator.js

COPY package.json package-lock.json index.js /

RUN npm ci

ENTRYPOINT [ "node", "/index.js" ]