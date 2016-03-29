Template.Notifications.helpers
   notifications: ()->
     #da(["trips-matcher"], "Right panel for notifications");
     return NotificationPanel

class @NotificationsController extends CarpoolController
  layoutTemplate: 'onePanelLayout',
