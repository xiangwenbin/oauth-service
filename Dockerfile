# Version:0.0.1
FROM node:6.9.1 
MAINTAINER xwb0128@gmail.com
ENV NODE_ENV production
ENV HTTP_PORT 8100

COPY . /oauth-service  
WORKDIR /oauth-service

RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 8100
#容器启动时候启动命令
ENTRYPOINT ["node", "index.js"]
#默认指令参数--ip 192.168.90.138
CMD ["--ip","192.168.90.138"]