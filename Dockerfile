# Step 1: Build the React app
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./  
RUN npm install
COPY . .  
RUN chmod +x node_modules/.bin/react-scripts  # react-scripts에 실행 권한 추가
RUN npm run build

# Step 2: Serve the app using nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
