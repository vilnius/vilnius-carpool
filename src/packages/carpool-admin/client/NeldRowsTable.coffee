Template.NeldRowsTable.events =
  'click .editItem': (event, template)->
    @editMode.set(true);
  'click .cancelItemEdit': (event, template)->
    @editMode.set(false);
  'click .saveItem': (event, template)->
    #values = getFormValues(template.data.form, template)
    #d "Neld values", values
    template.data.actions.save.call(this, event, template);
  'click .removeItem': (event, template)->
    template.data.actions.remove.call(this, event, template);
    @editMode.set(false);
