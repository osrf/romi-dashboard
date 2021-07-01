FROM ubuntu:20.04
ENV TZ=Asia/Singapore

RUN apt-get update && apt-get install -y curl && \
  curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  apt-get update && apt-get install -y nodejs python3-pip

RUN pip3 install pipenv

SHELL ["bash", "-c"]
COPY . /root/rmf-web
RUN npm config set unsafe-perm && \
  cd /root/rmf-web && \
  CI=1 npm install -g lerna@4 && lerna bootstrap --scope=reporting-server && \
  cd packages/reporting-server && \
  npm run prepack

FROM ubuntu:20.04
ENV TZ=Asia/Singapore

RUN apt-get update && apt-get install -y python3-pip
RUN pip3 install pipenv

COPY --from=0 /root/rmf-web/packages/reporting-server/dist/ .

SHELL ["bash", "-c"]
RUN pip3 install $(ls -1 | grep '.*.whl')[postgres]

RUN rm -rf /var/lib/apt/lists  

CMD ["reporting_server"]

