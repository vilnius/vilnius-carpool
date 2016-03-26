userForm = [
    {field: "email", type: 'text', label: "Email", clazz: "form-control", group:"details"},
    {field: "username", type: 'text', label: "User", clazz: "form-control", group:"details"},
    {field: "name", type: 'text', label: "Name", clazz: "form-control", group:"details"},
    {field: "password", type: 'text', label: "Password", clazz: "form-control", group:"details"},
    {field: "roles", type: 'listedit', label: "Role", clazz: "form-control", group:"details"},
]

class @UsersAdminController extends AdminController
  waitOn: ()->
    [Meteor.subscribe("adminUserContacts")]

  data: ()=>
    d("Forms subscribtion ready "+@ready())
    return unless @ready
    # Each collection item map to form
    forms = Meteor.users.find().map (item)->
      formValues: createFormValues userForm,
        username: item.username
        name: item.profile?.name or "Anonymous"
        roles: item.roles
        email: item.emails?[0]?.address
        , item._id, "#{item._id}-"

      editMode: new ReactiveVar(false)
      _id: item._id
    # Add empty form for new items
    forms.unshift
      formValues: createFormValues(userForm, {})
      editMode: new ReactiveVar(true)
    result =
      form: userForm
      forms: forms
      actions:
        save: (event, template)->
          values = getFormValues(@formValues, template, "#{@_id}-" if @_id)
          values.profile = name: values.name
          delete values.name
          d "Saving user", values
          if not @_id
            Meteor.call "createAccount", values, (err, result)=>
              if err then d "Account creating error", err
              else
                @editMode.set(false);
          else
            values._id = @_id
            Meteor.call "updateAccount", values, (err, result)=>
              if err then d "Account updating error", err
              else
                @editMode.set(false);
        remove: (event, template)->
          Meteor.call "deleteAccount", @_id, (err, result)=>
            if err then d "Account removing error", err
