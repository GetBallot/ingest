#!/usr/bin/python

import commands
import csv
import json
import os.path
import sys

elections = {}
contests = {}

dirname = os.path.dirname(sys.argv[0])
jsFile = os.path.normpath(os.path.join(dirname, '../functions/summarize.js'))

with open(sys.argv[1], 'rb') as csvfile:
  divisions = {}
  reader = csv.reader(csvfile, delimiter='\t', quotechar='"')
  for row in reader:
    division = row[0];
    electionDay = row[1];
    contest = row[3];
    if division == 'division':
      continue

    contests[' '.join([division, electionDay, contest])] = True
    elections[' '.join([division, electionDay])] = True

for key in contests.keys():
  cmd = 'node %s %s' % (jsFile, key)
  print commands.getoutput(cmd)

for key in elections.keys():
  cmd = 'node %s %s' % (jsFile, key)
  print commands.getoutput(cmd)
