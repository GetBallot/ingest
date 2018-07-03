#!/bin/bash

input=$1
cp $input functions/data.json
node functions/ingest.js
