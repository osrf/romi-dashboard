import unittest

from models.tortoise_models.raw_log import LogLevel

from .log_type_parser import get_log_type


class TestCaseLogTypeParserCase(unittest.TestCase):
    def setUp(self):
        pass

    def test_warning_messages(self):
        self.assertEqual(get_log_type("this is a Warn", "stdout"), LogLevel.WARN)
        self.assertEqual(get_log_type("WARN:", "stdout"), LogLevel.WARN)
        self.assertEqual(get_log_type("WARNING:", "stdout"), LogLevel.WARN)
        self.assertEqual(get_log_type("warn", "stdout"), LogLevel.WARN)

    def test_error_messages(self):
        self.assertEqual(get_log_type("this is an Error", "stdout"), LogLevel.ERROR)
        self.assertEqual(get_log_type("ERROR:", "stdout"), LogLevel.ERROR)
        self.assertEqual(get_log_type("error", "stdout"), LogLevel.ERROR)
        self.assertEqual(
            get_log_type("normal test with problems", "stderr"), LogLevel.ERROR
        )

    def test_debug_messages(self):
        self.assertEqual(get_log_type("this is a Debug msg", "stdout"), LogLevel.DEBUG)
        self.assertEqual(get_log_type("DEBUG:", "stdout"), LogLevel.DEBUG)
        self.assertEqual(get_log_type("debug", "stdout"), LogLevel.DEBUG)
        self.assertEqual(
            get_log_type("This is a random text", "stdout"), LogLevel.DEBUG
        )

    def test_info_messages(self):
        self.assertEqual(get_log_type("this is an Info msg", "stdout"), LogLevel.INFO)
        self.assertEqual(get_log_type("INFO:", "stdout"), LogLevel.INFO)
        self.assertEqual(get_log_type("info", "stdout"), LogLevel.INFO)
