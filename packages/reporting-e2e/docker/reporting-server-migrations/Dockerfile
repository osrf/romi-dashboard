ARG BASE_IMAGE=docker.pkg.github.com/open-rmf/rmf-web/reporting-server
FROM $BASE_IMAGE

SHELL ["bash", "-c"]

COPY packages/reporting-server/migrations/ /root/migrations/

CMD ["sh","-c", "cd root/migrations &&  aerich upgrade &&  echo \"upgrade complete\""]
