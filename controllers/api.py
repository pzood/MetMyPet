# Here go your api methods.

import logging

# set up debug logger
log = logging.getLogger("oatmeal")
log.setLevel(logging.DEBUG)

def get_profiles_list():
    rows = get_sitters_list()
    log.debug(rows)
    return "ok"

def get_owners_list():
    rows = db().select(db.auth_user.ALL, db.profile.ALL, db.pet_owner.ALL,
                       join=[
                           db.auth_user.on(db.auth_user.id == db.profile.userID),
                           db.profile.on(db.profile.id == db.pet_owner.profileID)
                       ])

    return response.json(dict(rows=rows))

def get_sitters_list():
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.profile.id == db.sitter.id)
    rows = []

    temp = set(db.profile.city == 'Santa Cruz')
    temp.select(db.auth_user.ALL, db.profile.ALL, db.sitter.ALL,)

    for row in temp :
        id = row.profile.id
        row.score = db(db.sitter_review.profileID == id).select(db.sitter_review.rating.avg())
        rows.append(row)

    return response.json(dict(rows=rows))
