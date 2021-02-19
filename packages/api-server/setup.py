from setuptools import setup

package_name = "api_server"

setup(
    name=package_name,
    description="RMF api server",
    version="0.0.0",
    packages=["api_server", "cli_client", "rest_server"],
    author="Teo Koon Peng",
    author_email="koonpeng@openrobotics.org",
    keywords=["ROS", "RMF"],
    classifiers=[
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python",
        "Topic :: Software Development",
    ],
    entry_points={
        "console_scripts": [
            "rmf_api_server=api_server.__main__:main",
            "rmf_api_cli=cli_client.__main__:main",
            "rmf_rest_server=rest_server.__main__:main",
        ],
    },
    license="Apache License, Version 2.0",
)
