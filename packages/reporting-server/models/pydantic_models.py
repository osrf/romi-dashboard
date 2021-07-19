from tortoise.contrib.pydantic import pydantic_model_creator

from .tortoise_models import (
    AuthEvents,
    Container,
    DispenserState,
    Door,
    DoorState,
    Fleet,
    FleetState,
    HealthStatus,
    IngestorState,
    Lift,
    LiftState,
    RawLog,
    Robot,
    TaskSummary,
)

AuthEvents_Pydantic = pydantic_model_creator(AuthEvents, name="AuthEvents")
Container_Pydantic = pydantic_model_creator(Container, name="Container")
DispenserState_Pydantic = pydantic_model_creator(DispenserState, name="DispenserState")
Door_Pydantic = pydantic_model_creator(Door, name="Door")
DoorState_Pydantic = pydantic_model_creator(DoorState, name="DoorState")
Fleet_Pydantic = pydantic_model_creator(Fleet, name="Fleet")
FleetState_Pydantic = pydantic_model_creator(FleetState, name="FleetState")
HealthStatus_Pydantic = pydantic_model_creator(HealthStatus, name="HealthStatus")
IngestorState_Pydantic = pydantic_model_creator(IngestorState, name="IngestorState")
Lift_Pydantic = pydantic_model_creator(Lift, name="Lift")
LiftState_Pydantic = pydantic_model_creator(LiftState, name="LiftStates")
RawLog_Pydantic = pydantic_model_creator(RawLog, name="RawLog")
Robot_Pydantic = pydantic_model_creator(Robot, name="Robot")
TaskSummary_Pydantic = pydantic_model_creator(TaskSummary, name="TaskSummary")
