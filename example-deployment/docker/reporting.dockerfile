FROM ros:foxy-ros-base-focal

RUN apt-get update && apt-get install -y curl && \
  curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  apt-get update && apt-get install -y nodejs python3-pip

RUN pip3 install pipenv

COPY . /root/rmf-web
SHELL ["bash", "-c"]

RUN npm config set unsafe-perm && cd /root/rmf-web && \
  CI=1 npm install -g lerna@4 && lerna bootstrap --scope=reporting

RUN cd /root/rmf-web/packages/reporting && \
  PUBLIC_URL='/reporting' \
  REACT_APP_REPORTING_SERVER='https://ntu.demo.open-rmf.org/logserver/api/v1' \
  REACT_APP_AUTH_PROVIDER='keycloak' \
  REACT_APP_KEYCLOAK_CONFIG='{ "realm": "rmf-web", "clientId": "reporting", "url": "https://ntu.demo.open-rmf.org/auth" }' \
  npm run build

###

FROM nginx:stable
COPY --from=0 /root/rmf-web/packages/reporting/build /usr/share/nginx/html/reporting
SHELL ["bash", "-c"]
RUN echo -e 'server {\n\
  location / {\n\
    root /usr/share/nginx/html;\n\
    index index.html index.htm;\n\
    try_files $uri /reporting/index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/reporting.conf
