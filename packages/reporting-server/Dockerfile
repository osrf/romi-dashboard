FROM ubuntu/postgres:13-21.04_beta

ENV POSTGRES_PASSWORD postgres 
ENV POSTGRES_DB testdb
ENV TZ UTC
EXPOSE 5432



# RUN apt-get update && apt-get install -y curl && \
#   apt-get update && apt-get install -y nodejs python3-pip

# RUN pip3 install fastapi tortoise-orm pydantic aerich asyncpg

SHELL ["bash", "-c"]
COPY . /root/rmf-web

RUN apt-get update && apt-get install -y curl && \
  curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  apt-get update && apt-get install -y nodejs python3-pip

RUN pip3 install pipenv

RUN npm config set unsafe-perm && \
  cd /root/rmf-web && \
  CI=1 npm install -g lerna@4 && lerna bootstrap --scope=reporting-server && \
  cd packages/reporting-server && \
  npm run prepack

RUN . /opt/rmf/setup.bash && \
  pip3 install $(ls -1 | grep '.*.whl')[postgres]

# cleanup
RUN rm -rf /var/lib/apt/lists && \
  npm cache clean --force

# RUN echo -e '#!/bin/bash\n\
#   cd root/reporting-server/test_migration &&  chmod +x migration.sh && ./migration.sh \n\
#   ' > /docker-entry-point.sh && chmod +x /docker-entry-point.sh

# ENTRYPOINT ["/docker-entry-point.sh"]
# CMD ["--help"]
