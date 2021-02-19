import asyncio
import unittest
from unittest.mock import MagicMock, call

from rmf_door_msgs.msg import DoorMode, DoorState
from rx.scheduler.historicalscheduler import HistoricalScheduler

from ..repositories import SqlRepository
from .book_keeper import RmfBookKeeper
from .gateway import RmfGateway
from .test_rmf_io import make_door_state


class TestRmfBookKeeperDoorStates(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.rmf = RmfGateway()
        self.repo = MagicMock(SqlRepository)
        self.book_keeper = RmfBookKeeper(self.rmf, self.repo)
        self.scheduler = HistoricalScheduler()
        self.book_keeper.start(scheduler=self.scheduler)

    async def test_write_frequency(self):
        """
        door states should write at a frequency of 1 hz
        """
        self.rmf.door_states.on_next(make_door_state("test_door"))
        self.scheduler.advance_by(0.9)
        # shouldn't write before t = 1
        self.repo.write_door_state.assert_not_called()
        self.scheduler.advance_by(0.1)
        await asyncio.sleep(0)
        self.repo.write_door_state.assert_awaited_once()

        self.rmf.door_states.on_next(make_door_state("test_door"))
        self.scheduler.advance_by(0.9)
        # shouldn't write again before t = 2
        self.repo.write_door_state.assert_awaited_once()
        self.scheduler.advance_by(0.1)
        await asyncio.sleep(0)
        self.assertEqual(self.repo.write_door_state.await_count, 2)

    async def test_write_latest(self):
        """
        the latest state every 1 hz should be written
        """
        state = make_door_state("test_door", DoorMode.MODE_CLOSED)
        self.rmf.door_states.on_next(state)

        self.scheduler.advance_by(0.5)
        state = make_door_state("test_door", DoorMode.MODE_CLOSED)
        self.rmf.door_states.on_next(state)

        self.scheduler.advance_by(0.4)
        state = make_door_state("test_door", DoorMode.MODE_OPEN)
        self.rmf.door_states.on_next(state)

        self.scheduler.advance_by(0.1)

        # at t = 0, mode = MODE_CLOSED
        # at t = 0.5, mode = MODE_CLOSED
        # at t = 0.9, mode = MODE_OPEN
        # at t = 1, write the latest state, i.e. MODE_OPEN

        class MatchState:
            def __eq__(self, state):
                return state.current_mode.value == DoorMode.MODE_OPEN

        await asyncio.sleep(0)
        self.repo.write_door_state.assert_awaited_once_with(MatchState())

    async def test_write_latest_multiple(self):
        """
        the latest state of each door should be written
        """
        state = make_door_state("test_door", DoorMode.MODE_CLOSED)
        self.rmf.door_states.on_next(state)
        state2 = make_door_state("test_door2", DoorMode.MODE_OPEN)
        self.rmf.door_states.on_next(state2)

        self.scheduler.advance_by(0.5)
        state = make_door_state("test_door", DoorMode.MODE_CLOSED)
        self.rmf.door_states.on_next(state)
        state2 = make_door_state("test_door2", DoorMode.MODE_OPEN)
        self.rmf.door_states.on_next(state2)

        self.scheduler.advance_by(0.4)
        state = make_door_state("test_door", DoorMode.MODE_OPEN)
        self.rmf.door_states.on_next(state)
        state2 = make_door_state("test_door2", DoorMode.MODE_CLOSED)
        self.rmf.door_states.on_next(state2)

        self.scheduler.advance_by(0.1)

        class MatchState:
            def __init__(self, name: str, mode: int):
                self.name = name
                self.mode = mode

            def __eq__(self, state: DoorState):
                return (
                    state.door_name == self.name
                    and state.current_mode.value == self.mode
                )

        await asyncio.sleep(0)
        calls = [
            call(MatchState("test_door", DoorMode.MODE_OPEN)),
            call(MatchState("test_door2", DoorMode.MODE_CLOSED)),
        ]
        self.assertEqual(self.repo.write_door_state.await_count, 2)
        self.repo.write_door_state.assert_has_awaits(calls)
