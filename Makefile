# Makefile for running both API and Frontend in separate terminals

.PHONY: all api fe up

api:
	cd ehr-cds-api && source ../real_medical/.venv/bin/activate && python main.py

fe:
	cd ehr-cds-web && pnpm dev

up:
	@echo "Starting API and Frontend in separate terminals..."
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/ehr-cds-api && source ../real_medical/.venv/bin/activate && python main.py"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/ehr-cds-web && pnpm dev"'
