#!/bin/bash

dir=`dirname $0`/..
name=`basename $1 | cut -f1 -d\.`

input="$dir/input/${name}.tsv"
output="$dir/output/${name}.json"

$dir/scripts/convert.py $input
$dir/scripts/ingest.sh $output
$dir/scripts/summarize.py $input
