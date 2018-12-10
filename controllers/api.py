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
    log.debug(result)
    return "ok"

# Get the sitters I need by city distance order
def get_sitters_list(cities):
    # Join auth_user, profile, and sitter
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.auth_user.id == db.sitter.userID)
    set = set(db.sitter.live == True)
    rows = []

    # Get people in order of city
    for city in cities:
        # Match city and select
        temp = set(db.profile.city == city)
        temp = temp.select(db.auth_user.ALL, db.profile.ALL, db.sitter.ALL)

        # Build new table with extra info
        for row in temp :
            id = row['auth_user']['id']
            avgScore = db.sitter_review.rating.avg()
            row['score'] = db(db.sitter_review.revieweeID == id).select(avgScore).first()[avgScore]
            rows.append(row)

    return response.json(dict(rows=rows))

# Get the owners I need by city distance order
def get_owners_list(cities):
    # Join auth_user, profile, and pet_owner
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.auth_user.id == db.pet_owner.userID)
    set = set(db.pet_owner.live == True)
    rows = []

    # Get people in order of city
    for city in cities:
        # Match city and select
        temp = set(db.profile.city == city)
        temp = temp.select(db.auth_user.ALL, db.profile.ALL, db.pet_owner.ALL)

        # Build new table with extra info
        for row in temp :
            id = row['auth_user']['id']
            avgScore = db.owner_review.rating.avg()
            row['score'] = db(db.owner_review.revieweeID == id).select(avgScore).first()[avgScore]
            pets = db(db.pet.auth_user == id).select()
            row['pets'] = []
            for pet in pets:
                row['pets'].append(pet)
            rows.append(row)

    return response.json(dict(rows=rows))
