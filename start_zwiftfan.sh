#!/bin/bash
cd "$(dirname "$0")"
until node zwiftfan_script.js; do	
    echo "Zwiftfan crashed! ....respawning..." >&2
    sleep 1
done