root = if (typeof global) is 'object' then global else window

React = require 'react'
{ createContainer } = require 'meteor/react-meteor-data';
{d, da}  = require 'meteor/spastai:logw'

{ ChatHistory } = require './model'


r = React.DOM

{div, h1} = React.DOM

#ChatBox = React.createClass
class ChatBox extends React.Component

  constructor: (props)->
    super props
    #d "Creating container", props
    @state =
      debug: false
      history: props.history

  setMessage: (e) =>
    @setState {message: e.target.value}

  sendMessage: ->
    # toggle debug flag
    if @state.message is ':debug'
      Session.set 'debug', (Session.get('debug') isnt true)
      @setState {message: ''}

    # reset data
    else if @state.message is ':reset'
      for {_id} in ChatHistory.find({}).fetch()
        ChatHistory.remove {_id}
      @setState {message: ''}

    # normal chat
    else unless @state.message is ''
      ChatHistory.insert {name: @state.name, message: @state.message}
      @setState {message: ''}, =>
        setTimeout @scrollToBottom, 1 # weird, shouldn't have to do this

  scrollToBottom: ->
    #pane = @refs.history.getDOMNode()
    #pane.scrollTop = pane.scrollHeight

  submitIfEnter: (e) ->
    if e.charCode is 13
      @sendMessage()

  renderChatMessage: (message, id) ->
    d "Message rendering args", arguments
    r.span {className: 'chat', key: "id1"}, [
      r.span {className: 'chat-author'}, message.name + ':'
      r.span {className: 'chat-message'}, message.message
    ]

  render: ->
    d "Rendering", @state
    r.div {className: 'chatbox'}, [
      if @state.debug
        r.pre {className: 'data-preview'},
          r.code {}, JSON.stringify(@state, null, '  ')

      # r.div {
      #   ref: 'history'
      #   className: 'history'
      # }, [
      #   @renderChatMessage {
      #     name: 'System'
      #     message: "Welcome, #{@state.name}!"
      #   }, "welcome-id"
      # ].concat @state.history.map @renderChatMessage

      r.div {className: 'controls'}, [
        r.input {
          ref: 'chatInput'
          className: 'chat-input'
          onKeyPress: @submitIfEnter
          onChange: @setMessage
          value: @state.message
          key: "1"
        }
        r.button {
          key: "2"
          className: 'sendButton'
          onClick: @sendMessage
        }, 'Send'
      ]]

  componentDidMount: ->
    #@refs.chatInput.getDOMNode().focus()
    @scrollToBottom()

  componentDidUpdate: ->
    @scrollToBottom()

ChatBox.propTypes = {
  history: React.PropTypes.array,
};


exports.Chat = createContainer (() ->
  result =
    history: ChatHistory.find().fetch()
    debug: Session.get('debug')
    name: Session.get('name')
), ChatBox
