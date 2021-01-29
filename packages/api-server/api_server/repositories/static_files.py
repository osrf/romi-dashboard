import os
from typing import Tuple


class StaticFilesRepository():
    def __init__(self, path: str, directory: str):
        '''
        Parameters:
            path: base path that static files are served from, MUST NOT end with '/'
            directory: directory to save static files to
        '''
        self.path = path
        self.directory = directory

    def add_file(self, data: bytes, path: str) -> Tuple[str, str]:
        '''
        Parameters:
            data:
            path: relative path to save the file to
        Returns:
            a tuple containing the path the file is saved to and the url path that 
            it is served from
        '''
        filepath = f'{self.directory}/{path}'
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'bw') as f:
            f.write(data)
        urlpath = f'{self.path}/{path}'
        return (filepath, urlpath)
