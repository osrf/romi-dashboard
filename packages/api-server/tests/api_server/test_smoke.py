import os
import subprocess
import time
import unittest


class TestApiServerSmoke(unittest.TestCase):
    def test_smoke(self):
        env = os.environ.copy()
        env["RMF_API_SERVER_CONFIG"] = f"{os.path.dirname(__file__)}/config.py"
        if "TEST_COVERAGE" in os.environ:
            proc = subprocess.Popen(
                ["python", "-m", "coverage", "run", "-a", "-m", "api_server"], env=env
            )
        else:
            proc = subprocess.Popen(["rmf_api_server"], env=env)
        time.sleep(5)
        self.assertIsNone(proc.poll())
        proc.terminate()
        proc.wait(5)
        self.assertEqual(proc.returncode, 0)
        if proc.poll() is not None:
            proc.kill()
            proc.wait()
