class FlowControllerHelper
  goToView: (view, params, query)->
    FlowRouter.go(view, params, query);

@flowControllerHelper = new FlowControllerHelper();
