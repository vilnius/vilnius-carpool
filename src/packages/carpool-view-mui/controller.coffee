class MuiControllerHelper
  goToView: (view, params, query)->
    FlowRouter.go(view, params, {query: query});

@muiControllerHelper = new MuiControllerHelper();
