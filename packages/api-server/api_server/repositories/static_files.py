import logging
import os
from typing import Tuple


class StaticFilesRepository:
    def __init__(
        self,
        path: str,
        directory: str,
        logger: logging.Logger = None,
    ):
        """
        Parameters:
            path: base path that static files are served from, MUST NOT end with '/'
            directory: directory to save static files to
        """
        self.path = path
        self.directory = directory
        self.logger = logger or logging.getLogger(self.__class__.__name__)

    def add_file(self, data: bytes, path: str) -> Tuple[str, str]:
        """
        Parameters:
            data:
            path: relative path to save the file to
        Returns:
            the url path of the new file
        """
        filepath = f"{self.directory}/{path}"
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "bw") as f:
            f.write(data)
        self.logger.info(f'saved new file "{filepath}"')
        urlpath = f"{self.path}/{path}"
        return urlpath
