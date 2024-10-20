FROM node:20.18-alpine

WORKDIR /app
COPY . /app/
RUN npm install
RUN npm install -g @angular/cli 
EXPOSE 8004
# CMD ["tail", "-f", "/dev/null"]
CMD [ "ng", "serve", "--port", "8004" ]
