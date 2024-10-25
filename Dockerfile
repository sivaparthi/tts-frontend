FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm i --save-dev @types/recordrtc
RUN npm install -g @angular/cli
COPY . .
EXPOSE 4200
# CMD ["tail", "-f", "/dev/null"]
CMD ["ng", "serve", "--host", "0.0.0.0"]
