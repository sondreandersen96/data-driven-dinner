

# Step 1: Build
FROM node:20-alpine as builder
WORKDIR /app
COPY package.json/ /app/
COPY package-lock.json /app/
RUN npm install --from-lock-file
COPY . .
RUN npm run build

# Step 2: Run
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
