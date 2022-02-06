FROM node:14.19.0
WORKDIR /app/sr
COPY src/package.json .
RUN npm install
RUN npm install --global expo/ngrok
RUN npm install --global expo-cli
EXPOSE 19002
CMD [ -d "node_modules" ] && expo start --tunnel || npm ci && expo start --tunnel
