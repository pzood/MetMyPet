# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

# logger.info("The user record is: %r" % auth.user)

import datetime

def get_user_email():
    return auth.user.email if auth.user else None

def get_current_time():
    return datetime.datetime.utcnow()

auth.enable_record_versioning(db)

db.define_table('profile',
                Field('userID', 'references auth_user'),
                Field('first_name', 'text'),
                Field('last_name', 'text'),
                Field('contact_info', 'text', default=get_user_email()),
                Field('city', 'text'),
                Field('image', 'upload'),
                Field('last_update', 'datetime', update=get_current_time()),
                )

db.define_table('sitter',
                Field('userID', 'references auth_user'),
                Field('live', 'boolean', default=True),
                Field('description', 'text'),
                )

db.define_table('pet_owner',
                Field('userID', 'references auth_user'),
                Field('live', 'boolean'),
                Field('description', 'text'),
                )
pet_categories =['Cat', 'Dog', 'Bird', 'Fish', 'Rodent','Reptile']

db.define_table('pet',
                Field('userID', 'references auth_user'),
                Field('pet_name', 'text', requires=IS_NOT_EMPTY()),
                Field('species', default='category', requires=IS_IN_SET(pet_categories)),
                Field('description', 'text', requires=IS_NOT_EMPTY()),
                )

db.define_table('sitter_review',
                Field('reviewerID', 'references auth_user'),
                Field('revieweeID', 'references auth_user'),
                Field('rating', 'float'),
                Field('feedback', 'text'),
                )

db.define_table('owner_review',
                Field('reviewerID', 'references auth_user'),
                Field('revieweeID', 'references auth_user'),
                Field('rating', 'float'),
                Field('feedback', 'text'),
                )
# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
