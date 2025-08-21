# 多阶段构建优化版本
FROM node:22-alpine as builder

# 设置工作目录
WORKDIR /app

# 安装必要的构建工具
RUN apk add --no-cache python3 make g++

# 复制package文件
COPY package*.json ./

# 安装依赖 (使用npm ci提升性能)
RUN npm ci --only=production && npm cache clean --force

# 复制源代码
COPY . .

# 构建应用 (开启所有优化)
ENV NODE_ENV=production
RUN npm run build

# 生产阶段 - 使用优化的nginx镜像
FROM nginx:alpine

# 安装额外工具用于监控
RUN apk add --no-cache curl htop

# 复制构建产物到nginx目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置文件
COPY nginx-app.conf /etc/nginx/conf.d/default.conf
# 暴露80端口
EXPOSE 80

# 使用更优雅的启动方式
CMD ["nginx", "-g", "daemon off;"]