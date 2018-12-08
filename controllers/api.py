# Here go your api methods.
@auth.requires_signature()
def make_profile():
	profile_entry = db.profile.insert(
		userID = auth.user.id,
		first_name = request.vars.first_name,
		last_name = request.vars.last_name,
		contact_info = request.vars.contact_info,
		city = request.vars.city
	)
	return response.json(dict(profile_entry=profile_entry))


# def get_profiles():
# 	results=[]
# 	if auth.user is None:
# 		rows = db().select(db.profile.ALL)
# 		for row in rows:
# 			get_results = (dict(
# 				id=row.id,
# 				name=row.name,
# 				contact_info=row.contact_info,
# 				city=row.city,
# 				last_update=row.last_update,
# 			))
# 			results.append(get_results)
# 	else:
# 		rows = db().select(db.auth_user.ALL, 
# 		                db.profile.ALL, 
# 		                join=[
# 		                    db.auth_user.on(db.auth_user.id=db.profile.userID), 
# 		                    db.profile.on(db.profile.id==db.owner.profileID && db.profile.id==db.sitter.profileID),
# 		                ])
		

# def get_owners():
# 	rows = db().select(db.auth_user.ALL, db.profile.ALL, db.owner.ALL, 
# 		               join=[
# 		                    db.auth_user.on(db.auth_user.id=db.profile.userID), 
# 		                    db.profile.on(db.profile.id==db.owner.profileID),
# 		                ])


# def get_sitters():
# 	rows = db().select(db.auth_user.ALL, db.profile.ALL, db.sitter.ALL, 
# 		               join=[
# 		                    db.auth_user.on(db.auth_user.id=db.profile.userID), 
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
	return response.JSON(dict(sitter_id=sitter_id))

# for owner form
@auth.requires_signature()
def add_owner():
	owner_id = db.pet_owner.insert(
		profileID= request.vars.profileID,
	    live = request.vars.live,
	    description = request.vars.description,
	)
	return response.JSON(dict(owner_id = owner_id))

#For adding pets (like replies)
@auth.requires_signature()
def add_pet():
	pet_entry = db.pet.insert(
		ownerID = request.vars.pet_owner.id,
	    pet_name = request.vars.pet_name,
	    species = request.vars.species,
	    description = request.vars.description
	)
	return response.JSON(dict(pet_entry = pet_entry))
