# This is a generated file, do not edit

from typing import List

import pydantic


class Priority(pydantic.BaseModel):
    value: pydantic.conint(ge=0, le=18446744073709551615) = 0  # uint64


# uint64 value 0
