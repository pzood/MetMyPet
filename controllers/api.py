# Here go your api methods.

import logging
import urllib, json

# set up debug logger
log = logging.getLogger("oatmeal")
log.setLevel(logging.DEBUG)

# Get the list of profiles I need
def get_profiles_list():
    # Must be set. Decides which one search to execute.
    role = request.vars.role

    # Optional search fields
    location = request.vars.location
    email = request.vars.email
    pet = request.vars.pet

    # Default location to user's location
    if location == '':
        location = db(db.profile.userID == auth.user.id).select(db.profile.city).first().city


    # Get JSON from API
    url = "http://getnearbycities.geobytes.com/GetNearbyCities?&radius=100&locationcode=" + location + ",%20CA&limit=5"
    get = urllib.urlopen(url)
    data = json.loads(get.read())

    log.debug(data)

    # Get 5 closest cities in order by distance
    cities = []
    for city in data:
        if len(city) > 0:
            cities.append(city[1])

    result = []
    if role == 'sitter':
        result = get_sitters_list(cities, email = email)
    elif role == 'owner':
        result = get_owners_list(cities, email = email, species = pet)

    return response.json(dict(cities = cities, result=result))

# Get the sitters I need by city distance order
def get_sitters_list(cities, email = ''):
    # Join auth_user, profile, and sitter
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.auth_user.id == db.sitter.userID)
    set = set(db.sitter.live == True)
    rows = []

    if email != '':
        # Filter by email
        set = set(db.auth_user.email == email)

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

    return rows

# Get the owners I need by city distance order
def get_owners_list(cities, email = '', species = ''):
    # Join auth_user, profile, and pet_owner
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.auth_user.id == db.pet_owner.userID)
    set = set(db.pet_owner.live == True)

    if email != '':
        # Filter by email
        set = set(db.auth_user.email == email)

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

            pets = db(db.pet.userID == id)
            if (species != ''):
                pets = pets(db.pet.species == species)
            pets = pets.select()
            row['pets'] = []
            for pet in pets:
                row['pets'].append(pet)
            rows.append(row)

    return rows
