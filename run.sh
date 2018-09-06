#!/bin/bash

dir=`dirname $0`

if [ ! -d input ]; then
  mkdir input
fi

if [ ! -d output ]; then
  mkdir output
fi

cat $dir/scripts/candidates.tsv | while read name docid
do
  input="$dir/input/${name}.tsv"
  if [ ! -f $input ]; then
   curl "https://docs.google.com/spreadsheets/d/$docid/export?gid=0&format=tsv" > $input
   $dir/scripts/run_one.sh $input
  fi
done
