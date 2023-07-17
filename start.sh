#!/bin/sh

pm2 start ecosystem.config.js --env production && pm2-runtime ecosystem.config.js --env production
