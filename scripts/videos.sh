#!/bin/bash

dirname=`dirname $0`
docid='1D1vrjbcOEBn-EdRjp7vScjxbBS-JnkFJGTes8bT7pKo'
output=/tmp/videos-`date +%s`.tsv
curl "https://docs.google.com/spreadsheets/d/$docid/export?gid=0&format=tsv" > $output

IFS=$'\n'       # make newlines the only separator
for line in `cat $output`; do
  path=`echo $line | cut -f1`
  if [ $path == 'path' ]; then
    continue
  fi

  ocd=`echo $path | cut -f3 -d/`
  electionDay=`echo $path | cut -f7 -d/`
  contestId=`echo $path | cut -f9 -d/`
  candidateId=`echo $path | cut -f11 -d/`

  url=`echo $line | cut -f2`
  thumbnail=`echo $line | cut -f3`
  audio=`echo $line | cut -f4 | sed -e 's/\&token/\&amp;token/'`

  echo -n "Updating $candidateId ... "
  node $dirname/../functions/videos.js \
    $ocd $electionDay $contestId $candidateId \
    $url $thumbnail $audio
  echo "done"

  node $dirname/../functions/summarize.js $ocd $electionDay $contestId
  node $dirname/../functions/summarize.js $ocd $electionDay
done

rm $output
