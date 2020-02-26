venv: venv/bin/activate
venv/bin/activate: requirements.txt
		test -d venv || virtualenv venv
		. venv/bin/activate; pip install --upgrade 'pip>=1.4'; 
		. venv/bin/activate; pip install -r requirements.txt
		touch venv/bin/activate
		echo "venv created"

.PHONY: default
default: venv app

.PHONY: app
app:
		python server.py

