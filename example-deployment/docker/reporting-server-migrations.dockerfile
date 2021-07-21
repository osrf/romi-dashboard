FROM rmf-web/reporting-server

SHELL ["bash", "-c"]

COPY packages/reporting-server/migrations/ /root/migrations/

CMD ["sh","-c", "cd root/migrations &&  aerich upgrade &&  echo \"upgrade complete\""]
