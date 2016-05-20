userForm = [
    {field: "_id", type: 'text', label: "Id", clazz: "form-control", group:"details"},
    {field: "owner", type: 'tripUsername', label: "User", clazz: "form-control", group:"details"},
    {field: "fromAddress", type: 'text', label: "From Address", clazz: "form-control", group:"details"},
    {field: "toAddress", type: 'text', label: "To Address", clazz: "form-control", group:"details"},
    {field: "fromLoc", type: 'text', label: "From loc", clazz: "form-control", group:"details"},
    {field: "toLoc", type: 'text', label: "From loc", clazz: "form-control", group:"details"},
    {field: "role", type: 'text', label: "Role", clazz: "form-control", group:"details"},
]

class @TripsAdminController extends AdminController
  waitOn: ()->
    [Meteor.subscribe("adminTrips")]

  data: ()=>
    #d("Forms subscribtion ready "+@ready())
    return unless @ready
    # Each collection item map to form
    forms = Trips.find().map (item)->
      formValues: createFormValues userForm, item,item._id, "#{item._id}-"

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
          delete values.name
          d "Saving trip", values
        remove: (event, template)->
          d "Removing trip", values
