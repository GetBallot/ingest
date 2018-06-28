#!/bin/bash

dir=`dirname $0`

cat $dir/scripts/candidates.tsv | while read name docid
do
  input="$dir/input/${name}.tsv"
  output="$dir/output/${name}.json"
  if [ ! -f $input ]; then
   curl "https://docs.google.com/spreadsheets/d/$docid/export?gid=0&format=tsv" > $input
   $dir/scripts/convert.py $input
   $dir/scripts/ingest.sh $output
  fi
done
