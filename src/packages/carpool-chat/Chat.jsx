import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';
import { TextField, Divider, Avatar, FloatingActionButton } from 'material-ui'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ContentSend from 'material-ui/lib/svg-icons/content/send'

import {d, da} from 'meteor/spastai:logw'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    //da(["chat"], "Contructor got", props.history)
    this.state = {
      message: '',
      history: props.history || []
    }
    this.sendMessage = this.sendMessage.bind(this)
    this.inputText = this.inputText.bind(this)
    this.checkEnter = this.checkEnter.bind(this)
  }

  sendMessage() {
    var {message} = this.state
    if("" !== message ) {
    }
    //d("Sending", message)
    ChatHistory.insert({message: this.state.message})
    this.setState({message:""});
  }

  inputText(event) {
    //d("Char:", event.charCode);
    // if(13 == event.charCode) {
    //   this.sendMessage();
    // } else {
    //   this.setState({message: this.state.message+String.fromCharCode(event.charCode)})
    // }
    this.setState({message: event.target.value})
  }

  checkEnter(event) {
    //d("Char:", event.charCode);
    if(13 == event.charCode) {
      this.sendMessage();
    }
  }

  render() {
    //da(["chat"], "Render got", this.props.history)
    const { history } = this.props;
    return (
      <div>
        <List>
          {history.map((item, i)=>(
            <div>
              <ListItem key={i} leftAvatar={<Avatar src="images/ok-128.jpg" />}
                primaryText={item.message} />
              <Divider inset={true} />
            </div>
          ))}
        </List>
        <div>
          <TextField onKeyPress={this.checkEnter} onChange={this.inputText} value={this.state.message}/>
          <FloatingActionButton mini onClick={this.sendMessage} >
            <ContentSend />
          </FloatingActionButton>
        </div>
      </div>
    )
  }
}

Chat.propTypes = {
  progress: React.PropTypes.object,
  history: React.PropTypes.array
};

export default ChatContainer = createContainer(() => {
  var handle = Meteor.subscribe("Chat");
  history = ChatHistory.find().fetch();
  //da(["chat"],"Container got", history);
  return {
    history: history
  }
}, Chat)
