FROM node:latest

EXPOSE 8080

ADD olkb-orders-web /olkb-orders-web
WORKDIR /olkb-orders-web

RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
RUN apt-get update -qq

RUN apt-get install vim -y

RUN yarn install
CMD yarn serve
