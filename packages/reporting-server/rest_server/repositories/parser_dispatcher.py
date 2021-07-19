from models.tortoise_models.dispenser_state import DispenserState
from models.tortoise_models.door import Door
from models.tortoise_models.door_state import DoorState
from models.tortoise_models.fleet import Fleet, Robot
from models.tortoise_models.fleet_state import FleetState
from models.tortoise_models.health import Device, HealthStatus
from models.tortoise_models.ingestor_state import IngestorState
from models.tortoise_models.lift import Lift
from models.tortoise_models.lift_state import LiftState
from models.tortoise_models.task_summary import TaskSummary
from parsers.dispenser_state_parser import dispenser_state_parser
from parsers.doors_state_parser import doors_state_parser
from parsers.fleet_state_parser import fleet_state_parser
from parsers.health_parser import health_status_parser
from parsers.ingestor_state_parser import ingestor_state_parser
from parsers.lift_state_parser import lift_state_parser
from parsers.task_summary_parser import task_summary_parser


async def create_health_status(data):
    device = await Device.get_or_create(actor=data["actor_id"], type=data["device"])
    await HealthStatus.create(
        device=device[0],
        health_status=data["health_status"],
        health_message=data["health_message"],
    )


# This function dispatchs to the correct handler dependending on the text content.


async def log_model_dispatcher(fullstring: str):
    if "dispenser_state:" in fullstring.lower():
        data = await dispenser_state_parser(fullstring)
        await DispenserState.create(**data)

    elif "door_state:" in fullstring.lower():
        data = await doors_state_parser(fullstring)
        door = await Door.get_or_create(name=data["name"])
        await DoorState.create(state=data["state"], door=door[0])

    elif "fleet_state:" in fullstring.lower():
        robot_states = await fleet_state_parser(fullstring)

        if len(robot_states) == 0:
            return

        for robot_state in robot_states:
            fleet = await Fleet.get_or_create(name=robot_state["fleet_name"])
            robot = await Robot.get_or_create(
                name=robot_state["robot_name"], model=robot_state["robot_model"]
            )
            del robot_state["fleet_name"]
            del robot_state["robot_name"]
            del robot_state["robot_model"]

            await FleetState.create(
                fleet=fleet[0],
                robot=robot[0],
                **robot_state,
            )

    elif "lift_state:" in fullstring.lower():
        data = await lift_state_parser(fullstring)
        lift = await Lift.get_or_create(name=data["name"])
        del data["name"]
        await LiftState.create(lift=lift[0], **data)

    elif "ingestor_state:" in fullstring.lower():
        data = await ingestor_state_parser(fullstring)
        await IngestorState.create(**data)

    elif "task_summary:" in fullstring.lower():
        data = await task_summary_parser(fullstring)
        fleet = await Fleet.get_or_create(name=data["fleet_name"])
        robot = await Robot.get_or_create(
            name=data["robot_name"],
        )
        del data["fleet_name"]
        del data["robot_name"]
        await TaskSummary.create(fleet=fleet[0], robot=robot[0], **data)

    # Health
    elif "dispenser_health:" in fullstring.lower():
        data = await health_status_parser(fullstring, "dispenser_health")
        await create_health_status(data)

    elif "door_health:" in fullstring.lower():
        data = await health_status_parser(fullstring, "door_health")

        await create_health_status(data)

    elif "ingestor_health:" in fullstring.lower():
        data = await health_status_parser(fullstring, "ingestor_health")
        await create_health_status(data)

    elif "lift_health:" in fullstring.lower():
        data = await health_status_parser(fullstring, "lift_health")
        await create_health_status(data)

    elif "robot_health:" in fullstring.lower():
        data = await health_status_parser(fullstring, "robot_health")
        await create_health_status(data)
