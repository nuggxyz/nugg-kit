#!/bin/bash

yarn prebuild || true

yarn tsc

sed -i '' -e "s/src\/index.ts\",/dist\/index.js\",/g" ./package.json

yarn npm publish --access public
