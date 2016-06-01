React = require 'react'
{ createContainer } = require 'meteor/react-meteor-data';
{d, da}  = require 'meteor/spastai:logw'

List = React.createFactory require 'material-ui/lib/lists/list';
ListItem = React.createFactory require 'material-ui/lib/lists/list-item';

TextField = React.createFactory require('material-ui').TextField
FloatingActionButton = React.createFactory require 'material-ui/lib/floating-action-button'
ContentSend = React.createFactory require 'material-ui/lib/svg-icons/content/send'


div = React.createFactory('div');

class Chat extends React.Component
  render: ->
    names = ["marius", "darius"]
    return div {}, [
      List {key:"content"}, names.map @renderChatMessage
      div {key: "bottom"}, [
        TextField {key: "messageInput"}
        FloatingActionButton {key: "button", mini: true, primary:true}, [
            ContentSend {key: "sendIcon"}
        ]
      ]
    ]

  renderChatMessage: (message, id)->
    ListItem {key: id, primaryText: message}


exports.Chat = Chat

  # <div id="bottom" class="bottom">
  #   <textarea id="input" class="input"></textarea>
  #   <div id="send" class="send"></div>
  # </div>
