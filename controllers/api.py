# Here go your api methods.

import logging
import urllib, json

# set up debug logger
log = logging.getLogger("oatmeal")
log.setLevel(logging.DEBUG)

# Get the list of profiles I need
def get_profiles_list():
    url = "http://getnearbycities.geobytes.com/GetNearbyCities?&radius=100&locationcode=Scotts Valley,%20CA&limit=20"
    response = urllib.urlopen(url)
    data = json.loads(response.read())

    cities = []
    for city in data:
        cities.append(city[1])

    result = get_owners_list(cities)
    log.debug(response.json(result))
    return "ok"

# Get the sitters I need by city distance order
def get_sitters_list(cities):
    # Join auth_user, profile, and sitter
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.profile.id == db.sitter.profileID)
    rows = []

    # Get people in order of city
    for city in cities:
        # Match city and select
        temp = set(db.profile.city == city)
        temp = temp.select(db.auth_user.ALL, db.profile.ALL, db.sitter.ALL)

        # Build new table with extra info
        for row in temp :
            id = row['profile']['id']
            avgScore = db.sitter_review.rating.avg()
            row['score'] = db(db.sitter_review.revieweeID == id).select(avgScore).first()[avgScore]
            rows.append(row)

    return dict(rows=rows)

# Get the owners I need by city distance order
def get_owners_list(cities):
    # Join auth_user, profile, and pet_owner
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.profile.id == db.pet_owner.profileID)
    rows = []

    # Get people in order of city
    for city in cities:
        # Match city and select
        temp = set(db.profile.city == city)
        temp = temp.select(db.auth_user.ALL, db.profile.ALL, db.pet_owner.ALL)

        # Build new table with extra info
        for row in temp :
            id = row['profile']['id']
            avgScore = db.owner_review.rating.avg()
            row['score'] = db(db.owner_review.revieweeID == id).select(avgScore).first()[avgScore]
            row['pets'] = db(db.pet.profileID == id).select()
            rows.append(row)

    return dict(rows=rows)
