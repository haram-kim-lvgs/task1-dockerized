#define the platform of the image
#https://docs.docker.com/engine/reference/builder/#from
#https://stackoverflow.com/questions/65612411/forcing-docker-to-use-linux-amd64-platform-by-default-on-macos
FROM --platform=linux/amd64 node:12.22.7
WORKDIR /src
COPY package.json .
#RUN command is mainly for building images and installing applications and packages
#RUN command builds new layer over existing image nad commits the results
RUN npm install
COPY . .
#either of at least 1 CMD or ENTRYPOINT is required to start
CMD ["npm", "start"]
