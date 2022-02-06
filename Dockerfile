FROM node:14.19.0
WORKDIR /app/src
COPY src/package.json .
RUN npm install
RUN npm install --global @expo/ngrok@^4.1.0
RUN npm install --global expo-cli
COPY . .
EXPOSE 19002
CMD ["expo", "start", "--tunnel"]