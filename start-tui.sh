#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Build Java JAR if not present
if [ ! -f "$SCRIPT_DIR/target/MultiCLIA-3.0-jar-with-dependencies.jar" ]; then
  echo "Building Java core..."
  cd "$SCRIPT_DIR"
  mvn package -q -DskipTests
fi

cd "$SCRIPT_DIR/tui"

# Install Node deps if missing
if [ ! -d "node_modules" ]; then
  echo "Installing Node dependencies..."
  npm install --silent
fi

exec npx tsx src/index.ts
