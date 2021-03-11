import os
import shutil
from os.path import join as pathjoin

import tortoise
from api_server.models import Door, DoorHealth, DoorState
from tortoise.contrib.pydantic import pydantic_model_creator

here = os.path.dirname(__file__)
schema_dir = pathjoin(here, "build", "schema")
shutil.rmtree(schema_dir, ignore_errors=True)
os.makedirs(schema_dir, exist_ok=True)


def write_schema(TortoiseModel: tortoise.Model, file_path: str):
    with open(file_path, "w") as f:
        model = pydantic_model_creator(TortoiseModel)
        f.write(model.schema_json(indent=2))
        print(file_path)


write_schema(Door, pathjoin(schema_dir, "door.json"))
write_schema(DoorState, pathjoin(schema_dir, "door-state.json"))
write_schema(DoorHealth, pathjoin(schema_dir, "door-health.json"))
