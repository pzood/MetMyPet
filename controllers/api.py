# Here go your api methods.
<<<<<<< HEAD

def __make_profile():
	profile_entry = db.profile.insert(
		contact_info = auth.user_email,
		city = request.cars.city,
		)
	return response.JSON(dict(profile_entry=profile_entry))

=======
@auth.requires_signature()
def make_profile():
	profile_entry = db.profile.insert(
		contact_info = auth.user_email,
		city = request.vars.city,
	)
	return response.JSON(dict(profile_entry=profile_entry))

# for sitter form
>>>>>>> 37e25f6f461d4b6700b99e98285124c9dfc07806
@auth.requires_signature()
def add_sitter():
	sitter_id = db.sitter.insert(
		live = request.vars.live,
<<<<<<< HEAD
		description = request.vars.description,
		)
	return response.JSON(dict(sitter_id=sitter_id))

=======
		descirption = request.vars.description,
	)
	return respone.JSON(dict(sitter_id=sitter_id))

# for owner form
>>>>>>> 37e25f6f461d4b6700b99e98285124c9dfc07806
@auth.requires_signature()
def add_owner():
	owner_id = db.pet_owner.insert(
		live = request.vars.live,
<<<<<<< HEAD
		description = request.vars.description,
		)
	return response.JSON(dict(owner_id = owner_id))

@auth.requires_singature()
=======
		descirption = request.vars.description,
	)
	return response.JSON(dict(owner_id=owner_id))

#For adding pets (like replies)
@auth.requires_signature()
>>>>>>> 37e25f6f461d4b6700b99e98285124c9dfc07806
def add_pet():
	pet_entry = db.pet.insert(
		name = request.vars.name,
		species = request.vars.species,
<<<<<<< HEAD
		description = request.vars.description
		)
	return response.JSON(dict(pet_entry = pet_entry))


=======
		descirption = request.vars.description,
	)
	return response.JSON(dict(pet_entry=pet_entry))
>>>>>>> 37e25f6f461d4b6700b99e98285124c9dfc07806
