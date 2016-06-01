React = require 'react'
{ createContainer } = require 'meteor/react-meteor-data';
{d, da}  = require 'meteor/spastai:logw'

List = React.createFactory require 'material-ui/lib/lists/list';
ListItem = React.createFactory require 'material-ui/lib/lists/list-item';

{h1, span} = React.DOM

div = React.createFactory('div');
textarea = React.createFactory('textarea');

  # <div class="message-wrapper them">
  #   <div class="circle-wrapper animated bounceIn"></div>
  #   <div class="text-wrapper animated fadeIn">Hello there!</div>
  # </div>
class Chat extends React.Component
  render: ->
    d "Rendering"
    names = ["marius", "drius"]
    return div {className:"chatWrapper"}, [
      div {key: "inner", className: "inner"}, [
        div {key: "content", className: "content"}, [
          div {className: "message-wrapper them"}, [
            div {className: "circle-wrapper animated bounceIn"}
            div {className: "text-wrapper animated fadeIn"}, "Hello there!"
          ]
        ]
      ]
      div {key: "bottom", className: "chatBottom"}, [
        div {key: "send", className: "send"}
      ]
    ]

  renderChatMessage: (message, id)->
    ListItem {key: id, primaryText: message}


exports.Chat = Chat

  # <div id="bottom" class="bottom">
  #   <textarea id="input" class="input"></textarea>
  #   <div id="send" class="send"></div>
  # </div>
