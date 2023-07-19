#!/bin/sh

# Ensure our application directories exist and have the correct permissions
chown -R expressjs:expressjs /app/whisper
chown -R expressjs:expressjs /app/uploads

# Then execute the command from CMD
exec "$@"
