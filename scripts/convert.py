#!/usr/bin/python

import csv
import json
import os.path
import sys

with open(sys.argv[1], 'rb') as csvfile:
  dirname = os.path.dirname(sys.argv[0])

  divisions = {}
  reader = csv.reader(csvfile, delimiter='\t', quotechar='"')
  for row in reader:
    for i in xrange(18 - len(row)):
      row.append('')
    (division, electionDay, electionName, contest, contestName, id, name, party, candidateUrl, phone, photoUrl, email, 
      Facebook, Twitter, Instagram, YouTube, Flickr, Vimeo) = row

    if division == 'division':
      continue

    candidate = {
      'name': name.strip(),
    }

    for key in ['party', 'candidateUrl', 'phone', 'photoUrl', 'email']:
      value = eval(key).strip()
      if len(value) > 0:
       candidate[key] = value

    channels = []
    for key in ['Facebook', 'Twitter', 'Instagram', 'YouTube', 'Flickr', 'Vimeo']:
      value = eval(key).strip()
      if len(value) > 0:
       channels.append({ 'type': key, 'id': value })
    if len(channels) > 0:
      candidate['channels'] = channels

    if division not in divisions:
      divisions[division] = { 'langs': {} }
    if 'en' not in divisions[division]['langs']:
      divisions[division]['langs']['en'] = { 'elections': {} }
    if electionDay not in divisions[division]['langs']['en']['elections']:
      divisions[division]['langs']['en']['elections'][electionDay] = {
        'electionDay': electionDay,
        'name': electionName,
        'contests': {}
      }
    election = divisions[division]['langs']['en']['elections'][electionDay]

    if contest not in election['contests']:
      election['contests'][contest] = {
        'name': contestName,
        'candidates': {}
      }
    contests = election['contests']

    contests[contest]['orderOnBallot'] = len(contests)
    if id not in contests[contest]['candidates']:
      contests[contest]['candidates'][id] = {}
    candidate['orderOnBallot'] = len(contests[contest]['candidates'])
    contests[contest]['candidates'][id] = candidate

  (name, ext) = os.path.splitext(os.path.basename(sys.argv[1]))

  filename = os.path.normpath(os.path.join(dirname, '../output/' + name + '.json'))
  writer = open(filename, 'w')
  writer.write(json.dumps({'divisions': divisions}, indent = 2))
  writer.close()
  print 'Converted %s to %s' % (os.path.normpath(sys.argv[1]), filename)
