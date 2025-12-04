#!/bin/bash
# Wrapper script to run prototype analyzer with correct PYTHONPATH

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PYTHONPATH="$SCRIPT_DIR/src:$PYTHONPATH"

# Run with the venv Python
exec "$SCRIPT_DIR/.venv/bin/python" "$SCRIPT_DIR/src/prototype_analyzer/main.py" "$@"
