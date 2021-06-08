FROM postgres:latest

ENV POSTGRES_PASSWORD postgres 
ENV POSTGRES_DB reporting
ENV TZ UTC
EXPOSE 5432

RUN apt-get update && apt-get install -y curl python3-pip pipenv
RUN pip3 install fastapi uvicorn tortoise-orm pydantic aerich asyncpg 

SHELL ["bash", "-c"]
COPY test_migration /root/reporting-server/
COPY migrations /root/reporting-server/migrations/

RUN echo -e '#!/bin/bash\n\
  cd root/reporting-server &&  aerich upgrade && aerich downgrade --yes -v 0 \n\ 
  # exec reporting_server "$@"\n\
  ' > /migrate.sh && chmod +x /migrate.sh

# ENTRYPOINT ["/docker-entry-point.sh"]

# CMD ["cd "]
CMD cd root/reporting-server; python3 check_port.py