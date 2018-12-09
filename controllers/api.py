import datetime

# Here go your api methods.
@auth.requires_signature()
def make_profile():
	profile_entry = db.profile.insert(
		userID = auth.user.id,
		first_name = request.vars.first_name,
		last_name = request.vars.last_name,
		contact_info = request.vars.contact_info,
		image = request.vars.image,
		city = request.vars.city,
	)
	return response.json(dict(profile_entry=profile_entry))

@auth.requires_signature()
def edit_profile():
	db((db.profile.id==request.vars.id)&(db.profile.userID==auth.user.id)).update(
		first_name=request.vars.first_name,
		last_name=request.vars.last_name,
		contact_info=request.vars.contact_info,
		city=request.vars.city,
		last_update=get_current_time(),
	)
	return "edited the profile"

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
	sitter_id = db.sitter.insert(
		profileID = request.vars.profileID,
	    live = request.vars.live,
	    description = request.vars.description,
	)
	return response.json(dict(sitter_id=sitter_id))

# for owner form
@auth.requires_signature()
def add_owner():
	owner_id = db.pet_owner.insert(
		profileID= request.vars.profileID,
	    live = request.vars.live,
	    description = request.vars.description,
	)
	return response.json(dict(owner_id = owner_id))

#For adding pets (like replies)
@auth.requires_signature()
def add_pet():
	pet_entry = db.pet.insert(
		ownerID = request.vars.pet_owner.id,
	    pet_name = request.vars.pet_name,
	    species = request.vars.species,
	    description = request.vars.description
	)
	return response.json(dict(pet_entry = pet_entry))
