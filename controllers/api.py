# Here go your api methods.
@auth.requires_signature()
def make_profile():
	profile_entry = db.profile.insert(
		name = request.vars.name,
		contact_info = auth.user_email,
		city = request.vars.city,
	)
	return response.JSON(dict(profile_entry=profile_entry))

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
		ownerID = request.vars.ownerID,
	    pet_name = request.vars.pet_name,
	    species = request.vars.species,
	    description = request.vars.description
	)
	return response.JSON(dict(pet_entry = pet_entry))
