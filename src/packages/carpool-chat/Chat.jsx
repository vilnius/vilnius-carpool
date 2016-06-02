import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';
import { TextField, Divider, Avatar, FloatingActionButton } from 'material-ui'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ContentSend from 'material-ui/lib/svg-icons/content/send'

import {d, da} from 'meteor/spastai:logw'
import { getUserName, getUserPicture } from 'meteor/carpool-view'

d("Imports getUserPicture", getUserPicture);
d("Imports getUserName", getUserName);

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
    ChatHistory.insert({
      message: this.state.message,
      to: this.props.cdUser._id,
      from: this.props.cgUser._id
    });
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
    const { history, cgUser, cdUser } = this.props;
    //da(["chat"],"Chat with", cdUser);
    cdName = getUserName(cdUser)
    cgAvatar = getUserPicture(cgUser);
    cdAvatar = getUserPicture(cdUser);
    return (
      <div>
        <List data-cucumber="chat-input" >
          {history.map((item, i)=>{
            //d("Check if message from is calling user", item)
            if(cgUser._id == item.from) {
              return (
                <div>
                  <ListItem key={i} leftAvatar={<Avatar src={cgAvatar} />}
                      primaryText={item.message} />
                  <Divider inset={true} />
                </div>
              )
            } else {
              return (
                <div>
                  <ListItem key={i} rightAvatar={<Avatar src={cdAvatar} />}
                      primaryText={item.message} />
                  <Divider inset={true} />
                </div>
              )

            }
        })}
        </List>
        <div>
          <TextField id="chatInput" onKeyPress={this.checkEnter}
              onChange={this.inputText} value={this.state.message}/>
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
  history: React.PropTypes.array,
  cdUser: React.PropTypes.object,
  cgUser: React.PropTypes.object,
};

export default ChatContainer = createContainer(({cdUserId}) => {
  var handle = Meteor.subscribe("Chat");
  history = ChatHistory.find().fetch();
  cdUser = Meteor.users.findOne(cdUserId)
  cgUser = Meteor.user();
  //da(["chat"],"Chat with", cdUser);

  return {
    history: history,
    cgUser: cgUser,
    cdUser: cdUser
  }
}, Chat)
