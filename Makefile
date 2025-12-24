# Makefile for running both API and Frontend in separate terminals


.PHONY: all api fe up down

api:
	cd ehr-cds-api && source .venv/bin/activate && python main.py

fe:
	cd ehr-cds-web && pnpm dev

up:
	@echo "Starting API and Frontend in separate terminals..."
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/ehr-cds-api && source .venv/bin/activate && python main.py"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/ehr-cds-web && pnpm dev"'

down:
	@echo "Stopping API and Frontend..."
	@pkill -f "python main.py" || true
	@pkill -f "pnpm dev" || true
	@osascript -e 'tell application "Terminal" to close (every window whose name contains "python main.py")' 2>/dev/null || true
	@osascript -e 'tell application "Terminal" to close (every window whose name contains "pnpm dev")' 2>/dev/null || true
