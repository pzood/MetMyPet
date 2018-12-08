# Here go your api methods.

import logging
import urllib, json

# set up debug logger
log = logging.getLogger("oatmeal")
log.setLevel(logging.DEBUG)

# grab the list of profiles I need
def get_profiles_list():
    url = "http://getnearbycities.geobytes.com/GetNearbyCities?&radius=100&locationcode=Scotts Valley,%20CA&limit=20"
    response = urllib.urlopen(url)
    data = json.loads(response.read())

    cities = []
    for city in data:
        cities.append(city[1])

    log.debug(get_sitters_list(cities))
    return "ok"

# grab the sitters I need by city distance order
def get_sitters_list(cities):
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.profile.id == db.sitter.id)
    rows = []

    for city in cities:
        temp = set(db.profile.city == city)
        temp = temp.select(db.auth_user.ALL, db.profile.ALL, db.sitter.ALL)

        for row in temp :
            id = row['profile']['id']
            avgScore = db.sitter_review.rating.avg()
            row['score'] = db(db.sitter_review.revieweeID == id).select(avgScore).first()[avgScore]
            rows.append(row)

    return response.json(dict(rows=rows))


def get_owners_list():
    return response.json(dict())
