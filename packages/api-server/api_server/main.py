import subprocess


def main():
    try:
        result = subprocess.run(['uvicorn', 'api_server.app:app'])
        exit(result.returncode)
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
