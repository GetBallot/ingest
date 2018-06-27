#!/bin/bash

input=$1
electionDay=`basename $1 | cut -f1 -d\|`
division=`basename $1 | cut -f2 -d\|`
contest=`basename $1 | cut -f3 -d\|`
candidate=`basename $1 | cut -f4 -d\| | sed -e 's/.json$//'`

cp $input functions/data.json
node functions/ingest.js
