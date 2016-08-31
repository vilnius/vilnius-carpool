class FlowControllerHelper
  showNotifiedView: (notification)->
    if notification.reason is "matched"
      da ["read-trip"], "Show matching trip for rider", notification
      @selectTrip(notification.trip, notification.filterTrip)
    else if notification.reason is "request"
      da ["read-trip"], "Show request for driver", notification
      @showDrive(notification.trip)
    else if notification.reason is "confirmation"
      da ["read-trip"], "Show confirmation for rider", notification
      @showPickup(notification.trip)
    else if notification.reason is "message"
      da ["trip-notifications"], "Show chat", notification
      notificationClient.dismissAlert(notification._id)
      FlowRouter.go("Chat", {cdUser: notification.context.from});

  goToView: (view, params, query)->
    FlowRouter.go(view, params, query);

@flowControllerHelper = new FlowControllerHelper();
