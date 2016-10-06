# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------


def index():
    """This displays two kind of things.
    If the user is not logged in, it displays a login button.
    If the user is logged in, it displays the list of checklists by the user.
    """
    checklists = None
    if auth.user_id is not None:
        # The user is logged in.
        # Gets the list of all checklists for the user.
        checklists = db(db.checklist.user_email == auth.user.email).select()
    return dict(checklists=checklists)

# Only access this if one is logged in.  The button to get here is displayed only if one is
# logged in, but remember, we cannot be sure how people get to pages.
# Also the user might have been logged in log ago, but now the session might have expired.
# So we need to check.
@auth.requires_login()
def create_checklist():
    """Creates a new checklist."""
    # We create a form for adding a new checklist item.  So far, the checklist items
    # are displayed in very rough form only.
    form = SQLFORM(db.checklist)
    if form.process().accepted:
        # At this point, the record has already been inserted.
        session.flash = T('Checklist added.')
        redirect(URL('default', 'index'))
    elif form.errors:
        session.flash = T('Please enter correct values.')
    return dict(form=form)


def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    return dict(form=auth())


@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()


