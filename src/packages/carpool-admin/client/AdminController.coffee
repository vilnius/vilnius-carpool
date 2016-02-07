class @AdminController extends EvaluationController
  onBeforeAction: (pause) ->
    @render('navbar', {to: 'navbar'});
    #d "Check the user has admin role", ;
    if _(Meteor.user()?.roles).contains('root')
      @render();
    else
      @render 'PageNotFound'
