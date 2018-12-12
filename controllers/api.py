import datetime


# Here go your api methods.
@auth.requires_signature()
def make_profile():
	profile_id = db.profile.update_or_insert(
		db.profile.userID==auth.user.id,
		userID = auth.user.id,
		first_name = request.vars.first_name,
		last_name = request.vars.last_name,
		contact_info = request.vars.contact_info,
		image = request.vars.image,
		city = request.vars.city,
	)
	return response.json(dict(profile_id=profile_id))

# @auth.requires_signature()
# def edit_profile():
# 	db((db.profile.id==request.vars.id)&(db.profile.userID==auth.user.id)).update(
# 		first_name=request.vars.first_name,
# 		last_name=request.vars.last_name,
# 		contact_info=request.vars.contact_info,
# 		city=request.vars.city,
# 		last_update=get_current_time(),
# 	)
# 	return "edited the profile"

# def get_profiles():
# 	results=[]
# 	if auth.user is None:
# 		rows = db().select(db.profile.ALL)
# 		for row in rows:
# 			get_results = (dict(
# 				id=row.id,
# 				first_name=row.first_name,
# 				last_name=row.last_name,
# 				contact_info=row.contact_info,
# 				city=row.city,
# 				last_update=row.last_update,
# 			))
# 			results.append(get_results)
# 	else:
# 		rows = db().select(db.auth_user.ALL, 
# 		                db.profile.ALL, 
# 		                join=[
# 		                    db.auth_user.on(db.auth_user.id==db.profile.userID), 
# 		                    db.profile.on((db.profile.id==db.pet_owner.profileID) & (db.profile.id==db.sitter.profileID)),
# 		                ])
# 		for row in rows:
# 			results.append(dict(
# 				id=row.id,
# 				first_name=row.first_name,
# 				last_name=row.last_name,
# 				contact_info=row.contact_info,
# 				city=row.city,
# 				last_update=row.last_update,
# 			))
# 	return response.json(dict(profile_list=results))


# def get_owners():
# 	rows = db().select(db.auth_user.ALL, db.profile.ALL, db.owner.ALL, 
# 		               join=[
# 		                    db.auth_user.on(db.auth_user.id==db.profile.userID), 
# 		                    db.profile.on(db.profile.id==db.pet_owner.profileID),
# 		                ])


# def get_sitters():
# 	rows = db().select(db.auth_user.ALL, db.profile.ALL, db.sitter.ALL, 
# 		               join=[
# 		                    db.auth_user.on(db.auth_user.id==db.profile.userID), 
# 		                    db.profile.on(db.profile.id==db.sitter.profileID),
# 		                ])


# for sitter form
@auth.requires_signature()
def add_sitter():
	sitter_id = db.sitter.update_or_insert(
		db.sitter.userID==auth.user.id,
		userID= auth.user.id,
	    live = request.vars.live,
	    description = request.vars.description,
	)
	return response.json(dict(sitter_id=sitter_id))

# for owner form
@auth.requires_signature()
def add_owner():
	owner_id = db.pet_owner.update_or_insert(
		db.pet_owner.userID == auth.user.id,
		userID = auth.user.id,
	    live = request.vars.live,
	    description = request.vars.description,
	)
	return response.json(dict(owner_id = owner_id))

#For adding pets (like replies)
@auth.requires_signature()
def add_pet():
	pet_id = db.pet.insert(
		userID = auth.user.id,
	    pet_name = request.vars.pet_name,
	    species = request.vars.species,
	    description = request.vars.description,
	)
	return response.json(dict(pet_id = pet_id))

def get_image():
    profile = db(db.profile.userID == auth.user.id).select().first()
    image_url = profile.image
    return response.json(dict(image_url=image_url))

def get_petlist():
	pet_list = db(db.pet.userID == auth.user.id).select()
	return response.json(dict(pet_list = pet_list))

def delete_pet():
	db(db.pet.id == request.vars.id).delete()
	return "ok"
