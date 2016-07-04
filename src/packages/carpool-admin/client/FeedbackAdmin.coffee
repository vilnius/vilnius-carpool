feedbackForm = [
    {field: "userId", type: 'username', label: "User", clazz: "form-control", group:"details"},
    {field: "text", type: 'text', label: "Text", clazz: "form-control", group:"details"},
]

###
  Controller to load stops
###
Template.FeedbackAdmin.onCreated ()->
  @autorun ()=>
    @subscribe "feedback"

Template.FeedbackAdmin.helpers
  form: ()->
    return feedbackForm

  forms: ()->
    #d "Each collection item map to form"
    forms = Feedback.find().map (item)->
      #d "Mapping", item
      formValues: createFormValues feedbackForm, item,item._id, "#{item._id}-"
      editMode: new ReactiveVar(false)
      _id: item._id
    # Add empty form for new items
    forms.unshift
      formValues: createFormValues(feedbackForm, {})
      editMode: new ReactiveVar(true)
    return forms

    actions: ()->
      save: (event, template)->
        values = getFormValues(@formValues, template, "#{@_id}-" if @_id)
        delete values.name
        d "Saving trip", values
      remove: (event, template)->
        d "Removing trip", values


# class @TripsAdminController extends AdminController
#   waitOn: ()->
#     [Meteor.subscribe("adminTrips")]
#
#   data: ()=>
#     #d("Forms subscribtion ready "+@ready())
#     return unless @ready
#     # Each collection item map to form
#     forms = Trips.find().map (item)->
#       formValues: createFormValues userForm, item,item._id, "#{item._id}-"
#
#       editMode: new ReactiveVar(false)
#       _id: item._id
#     # Add empty form for new items
#     forms.unshift
#       formValues: createFormValues(userForm, {})
#       editMode: new ReactiveVar(true)
#     result =
#       form: userForm
#       forms: forms
#       actions:
#         save: (event, template)->
#           values = getFormValues(@formValues, template, "#{@_id}-" if @_id)
#           delete values.name
#           d "Saving trip", values
#         remove: (event, template)->
#           d "Removing trip", values
