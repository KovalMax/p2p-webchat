#!/bin/sh
set -eo pipefail

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Waiting
until nc -z -v -w30 ${APP_DB_HOST} ${APP_DB_PORT}
do
  echo "Waiting for database connection..."
  sleep 5
done