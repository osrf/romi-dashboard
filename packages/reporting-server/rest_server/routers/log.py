from fastapi import APIRouter, HTTPException, status
from rest_server.repositories.log_creation_handler import (
    RawLogHandler,
    create_keycloak_log,
)
from rest_server.repositories.rmf_log_creation_handler import create_rmf_server_log

router = APIRouter()


# This will receive information from different sources
@router.post("/all/", tags=["all_logs"], status_code=status.HTTP_201_CREATED)
async def write_logs(body: list):
    try:
        return await RawLogHandler.create_raw_log(body)
    except Exception as e:
        print(e)
        raise HTTPException(503, "cannot create the log" + str(e)) from e


# Will receive information from rmf-server only
@router.post(
    "/rmfserver/", tags=["rmfserver_logs"], status_code=status.HTTP_201_CREATED
)
async def write_rmf_server_logs(body: list):
    try:
        response = await create_rmf_server_log(body)
        if not isinstance(response, str):
            raise HTTPException(503, "Error creating some logs" + str(response))

        return response

    except Exception as e:
        print(e)
        raise HTTPException(503, "cannot create the rmfserver log" + str(e)) from e


# Will receive information from keycloak only
@router.post("/keycloak/", tags=["keycloak_logs"], status_code=status.HTTP_201_CREATED)
async def write_keycloak_logs(body: list):
    try:
        response = await create_keycloak_log(body)
        if not isinstance(response, str):
            raise HTTPException(503, "Error creating some logs" + str(response))

        return response

    except Exception as e:
        print(e)
        raise HTTPException(503, "cannot create the keycloak log" + str(e)) from e
