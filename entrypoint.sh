#!/bin/sh

# If PGID or PUID are set, recreate user and group
if [ ! -z "$PGID" ]; then
    delgroup expressjs
    addgroup --gid $PGID expressjs
fi

if [ ! -z "$PUID" ]; then
    deluser expressjs
    adduser --uid $PUID --gid $PGID --system --no-create-home expressjs
fi

# Ensure our application directories exist and have the correct permissions
chown -R expressjs:expressjs /app/whisper
chown -R expressjs:expressjs /app/uploads

# Then execute the command from CMD
exec "$@"
