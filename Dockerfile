FROM nginx:alpine
COPY dist/lpm-angular/ /usr/share/nginx/html/
COPY /nginx.conf /etc/nginx/conf.d/default.conf