from setuptools import setup

package_name = 'api_server'

setup(
    name=package_name,
    description='RMF api server',
    version='0.0.0',
    packages=['api_server'],
    install_requires=['fastapi', 'uvicorn', 'aiofiles'],
    author='Morgan Quigley',
    author_email='morgan@osrfoundation.org',
    maintainer='Morgan Quigley',
    maintainer_email='morgan@osrfoundation.org',
    keywords=['ROS', 'RMF'],
    classifiers=[
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python',
        'Topic :: Software Development',
    ],
    entry_points={
        'console_scripts': [
            'rmf_api_server=api_server.main:main',
        ],
    },
    license='Apache License, Version 2.0',
)
