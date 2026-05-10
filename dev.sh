#!/bin/bash

# Start development servers for localgeist and its dependencies
# Usage: ./dev.sh

set -e

echo "Starting development servers..."
echo ""

# Check if required directories exist
if [ ! -d "../pi" ]; then
    echo "Error: pi not found at ../pi"
    exit 1
fi

if [ ! -d "../mini-lit" ]; then
    echo "Error: mini-lit not found at ../mini-lit"
    exit 1
fi

# Kill all child processes on exit
trap 'echo ""; echo "Stopping all dev servers..."; kill 0' EXIT INT TERM

# Start dev servers
echo "Starting mini-lit dev server..."
(cd ../mini-lit && npm run dev:tsc) &
MINI_LIT_PID=$!

echo "Starting pi dev server..."
(cd ../pi && npm run dev:tsc) &
PI_PID=$!

# Wait a moment for dependencies to start building
sleep 2

echo "Starting localgeist dev server..."
npm run dev &
LOCALGEIST_PID=$!

echo ""
echo "All dev services started"
echo "  mini-lit: watching"
echo "  pi: watching"
echo "  localgeist: watching"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all background jobs
wait
