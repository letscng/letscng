import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# # Use the application default credentials
# cred = credentials.ApplicationDefault()
# firebase_admin.initialize_app(cred, {
#   'projectId': project_id,
# })

# db = firestore.client()

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('/Users/rads284/Desktop/1177/src/assets/extra/challenge1177-7ec412ea0e7b.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

data = {
    u'name': u'Los Angeles',
    u'state': u'CA',
    u'country': u'USA'
}

# Add a new doc in collection 'cities' with ID 'LA'

import json

with open('data.json') as f:
  data = json.load(f)
#   print(data[i])
  db.collection(u'challenges').document(u'risingstar2021').set(data)