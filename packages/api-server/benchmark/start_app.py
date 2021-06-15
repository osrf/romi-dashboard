import cProfile
import os

import api_server.__main__

if os.environ.get("RMF_API_SERVER_PROFILE", "false").lower() in ["true", "1"]:
    cProfile.run("api_server.__main__.main()", "profile.txt")
else:
    api_server.__main__.main()
