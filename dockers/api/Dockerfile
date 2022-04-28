FROM node:18-alpine
#a add bash and git to use wait for it to run migration
# --no-cache to keep image size small
#add git to alpine image
RUN apk add --no-cache git
#add bash to alpine image
RUN apk add --no-cache bash
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
RUN chown -R node:node /usr/src/app
USER node
EXPOSE 4000
# check for database is up to run specific commands (db_migration)
RUN git clone https://github.com/vishnubob/wait-for-it.git
# CMD ["npm", "run", "test"]

