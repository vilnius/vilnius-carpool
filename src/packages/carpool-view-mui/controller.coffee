class MuiControllerHelper
  goToView: (view, params, query)->
    Router.go(view, params, {query: query});

@muiControllerHelper = new MuiControllerHelper();
