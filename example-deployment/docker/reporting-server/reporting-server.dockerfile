FROM rmf-web/reporting-server-base

SHELL ["bash", "-c"]

RUN echo -e '#!/bin/bash\n\
  cd root/reporting-server &&  aerich upgrade \n\ 
  exec reporting_server "$@"\n\
  ' > /docker-entry-point.sh && chmod +x /docker-entry-point.sh

ENTRYPOINT ["/docker-entry-point.sh"]
CMD ["--help"]
