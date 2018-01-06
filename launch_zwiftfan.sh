#!/bin/bash
cd "$(dirname "$0")"
until node zwiftfan.js; do	
    echo "Zwiftfan crashed! ....respawning..." >&2
    sleep 1
done