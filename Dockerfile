FROM alpine:latest as base

RUN apk update && \
    apk add nodejs npm python3 py3-pip \
    tesseract-ocr graphicsmagick git

FROM base
WORKDIR /usr/src/app
RUN mkdir /usr/src/app/data

COPY package*.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

CMD ["npm", "run", "start"]