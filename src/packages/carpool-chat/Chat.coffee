React = require 'react'
{ createContainer } = require 'meteor/react-meteor-data';
{d, da}  = require 'meteor/spastai:logw'

List = React.createFactory require 'material-ui/lib/lists/list';
ListItem = React.createFactory require 'material-ui/lib/lists/list-item';

{h1, span} = React.DOM

div = React.createFactory('div');

class Chat extends React.Component
  render: ->
    d "Rendering"
    names = ["marius", "drius"]
    #return div {className:"some"}, names.map @renderChatMessage
    return List {className:"some"}, names.map @renderChatMessage

  renderChatMessage: (message, id)->
    ListItem {key: id, primaryText: message}


exports.Chat = Chat
