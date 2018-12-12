import datetime
import logging
import urllib, json

# set up debug logger
log = logging.getLogger("oatmeal")
log.setLevel(logging.DEBUG)

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

# def get_image():
#     profile = db(db.profile.userID == auth.user.id).select().first()
#     image_url = profile.image
#     return response.json(dict(image_url=image_url))

def get_petlist():
	pet_list = db(db.pet.userID == auth.user.id).select()
	return response.json(dict(pet_list = pet_list))

def delete_pet():
	db(db.pet.id == request.vars.id).delete()
	return "ok"

def view_profile():
	user_id=request.vars.userID
	currProfile=db(db.profile.userID==user_id).select()
	profilePic=db(db.profile.userID==user_id).select().first()
	image_url = profilePic.image
	currSitter=db(db.sitter.userID==user_id).select()
	currOwner=db(db.pet_owner.userID==user_id).select()
	currPets=db(db.pet.userID==user_id).select()
	logger.info(currOwner)
	return response.json(dict(currProfile=currProfile, image_url=image_url, currSitter=currSitter, currOwner=currOwner, currPets=currPets))

# Get the list of profiles I need
def get_profiles_list():
    url = "http://getnearbycities.geobytes.com/GetNearbyCities?&radius=100&locationcode=Scotts Valley,%20CA&limit=5"
    get = urllib.urlopen(url)
    data = json.loads(get.read())

    cities = []
    for city in data:
        cities.append(city[1])

    result = get_owners_list(cities)
    return response.json(dict(result=result, cities=cities))

# Get the sitters I need by city distance order
def get_sitters_list(cities):
    # Join auth_user, profile, and sitter
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.auth_user.id == db.sitter.userID)
    set = set(db.sitter.live == True)
    rows = []

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

    return response.json(dict(rows=rows))

# Get the owners I need by city distance order
def get_owners_list(cities):
    # Join auth_user, profile, and pet_owner
    set = db(db.auth_user.id == db.profile.userID)
    set = set(db.auth_user.id == db.pet_owner.userID)
    set = set(db.pet_owner.live == True)
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
            pets = db(db.pet.userID == id).select()
            row['pets'] = []
            for pet in pets:
                row['pets'].append(pet)
            rows.append(row)
    return rows
