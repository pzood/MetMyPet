# Here go your api methods.

def __make_profile():
	profile_entry = db.profile.insert(
		contact_info = auth.user_email,
		city = request.cars.city,
		)
	return response.JSON(dict(profile_entry=profile_entry))

@auth.requires_signature()
def add_sitter():
	sitter_id = db.sitter.insert(
		live = request.vars.live,
		description = request.vars.description,
		)
	return response.JSON(dict(sitter_id=sitter_id))

@auth.requires_signature()
def add_owner():
	owner_id = db.pet_owner.insert(
		live = request.vars.live,
		description = request.vars.description,
		)
	return response.JSON(dict(owner_id = owner_id))

@auth.requires_singature()
def add_pet():
	pet_entry = db.pet.insert(
		name = request.vars.name,
		species = request.vars.species,
		description = request.vars.description
		)
	return response.JSON(dict(pet_entry = pet_entry))


