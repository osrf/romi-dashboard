# Setup

Let's create a virtual environment named `venv` for all this Python magic:
```
sudo apt install python3-venv
python3 -m venv --system-site-packages .venv
```

Now let's activate the Python virtual environment and install all sorts of things into it without breaking our system:
```
. .venv/bin/activate
pip3 install -e .
```

# Run development server

```bash
./run.sh
```
