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
def edit():
    """Creates, displays, or views a new checklist:
    - If there is no checklist id, it offers a form to create a checklist.
    - If there is a checklist id, it offers a form to display a checklist.
    - If there is a checklist id, and there is an additional argument edit=true, it offers a form
      to edit or delete a checklist.
    """
    if request.args(0) is None:
        # request.args[0] would give an error if there is no argument 0.
        form_type = 'create' # aaaagh, I am wasting computation! heat! global warming!
        # We create a form for adding a new checklist item.  So far, the checklist items
        # are displayed in very rough form only.
        form = SQLFORM(db.checklist)
    else:
        # A checklist is specified.  We need to check that it exists, and that the user is the author.
        # We use .first() to get either the first element or None, rather than an iterator.
        cl = db((db.checklist.user_email == auth.user.email) &
                (db.checklist.id == request.args(0))).select().first()
        if cl is None:
            session.flash = T('Not Authorized')
            redirect(URL('default', 'index'))
        # Always write invariants in your code.
        # Here, the invariant is that the checklist is known to exist.
        # Is this an edit form?
        is_edit = (request.vars.edit == 'true')
        form_type = 'edit' if is_edit else 'view'
        form = SQLFORM(db.checklist, record=cl, deletable=is_edit, readonly=not is_edit)

    # Adds some buttons.  Yes, this is essentially glorified GOTO logic.
    button_list = []
    if form_type == 'edit':
        button_list.append(A('Cancel', _class='btn btn-warning',
                             _href=URL('default', 'edit', args=[cl.id])))
    elif form_type == 'create':
        button_list.append(A('Cancel', _class='btn btn-warning',
                             _href=URL('default', 'index')))
    elif form_type == 'view':
        button_list.append(A('Edit', _class='btn btn-warning',
                             _href=URL('default', 'edit', args=[cl.id], vars=dict(edit='true'))))
        button_list.append(A('Back', _class='btn btn-primary',
                             _href=URL('default', 'index')))

    if form.process().accepted:
        # At this point, the record has already been inserted.
        session.flash = T('Checklist added.')
        redirect(URL('default', 'index'))
    elif form.errors:
        session.flash = T('Please enter correct values.')
    return dict(form=form, button_list=button_list)



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


