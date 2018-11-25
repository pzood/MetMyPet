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
    return None if auth.user is None else auth.user.email

def get_current_time():
    return datetime.datetime.utcnow()

db.define_table('profile',
                Field('userID', 'references auth_user'),
                Field('contact_info', 'text', default=get_user_email()),
                Field('city', 'text'),
                Field('last_update', 'datetime', update=get_current_time()),
                )

db.define_table('sitter',
                Field('profileID', 'references profile'),
                Field('active', 'boolean'),
                Field('description', 'text'),
                )

db.define_table('pet_owner',
                Field('profileID', 'references profile'),
                Field('active', 'boolean'),
                Field('description', 'text'),
                )

db.define_table('pet',
                Field('profileID', 'references profile'),
                Field('name', 'text'),
                Field('species', 'text'),
                Field('description', 'text'),
                )

db.define_table('sitter_review',
                Field('reviewerID', 'references profile'),
                Field('revieweeID', 'references profile'),
                Field('rating', 'int'),
                Field('content', 'text'),
                )

db.define_table('owner_review',
                Field('reviewerID', 'references profile'),
                Field('revieweeID', 'references profile'),
                Field('rating', 'int'),
                Field('content', 'text'),
                )
# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
