# Here go your api methods.

import logging

# set up debug logger
log = logging.getLogger("oatmeal")
log.setLevel(logging.DEBUG)

def get_profiles_list():
    log.debug(get_owners_list())
    log.debug("\n")
    log.debug(get_sitters_list())
    return "ok"

def get_owners_list():
    rows = db().select(db.auth_user.ALL, db.profile.ALL, db.pet_owner.ALL,
                       join=[
                           db.auth_user.on(db.auth_user.id == db.profile.userID),
                           db.profile.on(db.profile.id == db.pet_owner.profileID)
                       ])

    return response.json(dict(rows=rows))

def get_sitters_list():
    rows = db().select(db.auth_user.id, db.profile.userID, db.profile.id, db.sitter.profileID,
                       join=[
                           db.auth_user.on(db.auth_user.id == db.profile.userID),
                           db.profile.on(db.profile.id == db.sitter.profileID)
                       ])

    return response.json(dict(rows=rows))