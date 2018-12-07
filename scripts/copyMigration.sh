#!/bin/sh

MIGTIME=`TZ=GMT date +%Y%m%d%H%M%S`
cp scripts/migrationTemplate.js src/migrations/${MIGTIME}_$1.js