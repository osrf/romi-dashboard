from datetime import timezone
from unittest import TestCase

from dateutil import parser
from rest_server.repositories.report.utils import get_date_range_query


class TestCaseUtils(TestCase):
    def setUp(self):
        self.raw_from_log_date = "2018-01-01"
        self.raw_to_log_date = "2018-02-01"

        self.from_log_date = parser.parse(self.raw_from_log_date).astimezone(
            timezone.utc
        )
        self.to_log_date = parser.parse(self.raw_to_log_date).astimezone(timezone.utc)

    def test_get_date_range_query_with_no_date_range(self):
        self.assertEqual(get_date_range_query(), {})

    def test_get_date_range_query(self):
        self.assertEqual(
            get_date_range_query(
                to_log_date=self.raw_to_log_date, from_log_date=self.raw_from_log_date
            ),
            {"created__gte": self.from_log_date, "created__lt": self.to_log_date},
        )

    def test_get_date_range_with_to_log_date(self):
        self.assertEqual(
            get_date_range_query(to_log_date=self.raw_to_log_date),
            {"created__lt": self.to_log_date},
        )

    def test_get_date_range_with_from_log_date(self):
        self.assertEqual(
            get_date_range_query(from_log_date=self.raw_from_log_date),
            {"created__gte": self.from_log_date},
        )
