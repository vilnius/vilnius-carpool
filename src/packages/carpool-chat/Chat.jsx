import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';
import { TextField, Divider, Avatar, FloatingActionButton } from 'material-ui'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ContentSend from 'material-ui/lib/svg-icons/content/send'

import {d, da} from 'meteor/spastai:logw'
import { getUserName, getUserPicture } from 'meteor/carpool-view'

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
    carpoolService.sendMessage(this.props.cdUser._id, this.state.message);
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

  renderAvatar (avatarSrc, name) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Avatar src={avatarSrc} size={32} />
        <div style={{fontSize: 13}}>{name.split(' ')[0]}</div>
      </div>
    )
  }

  render() {
    //da(["chat"], "Render got", this.props.history)
    const { history, cgUser, cdUser } = this.props;
    //da(["chat"],"Chat with", cdUser);
    const cdName = getUserName(cdUser)
    const cgName = getUserName(cgUser)
    const cgAvatar = getUserPicture(cgUser);
    const cdAvatar = getUserPicture(cdUser);
    let lastMessageYour = undefined
    return (
      <div>
        <List data-cucumber="chat-input" >
          {history.map((item, i)=>{
            //d("Check if message from is calling user", item)
            if(cgUser._id == item.from) {
              const displayAvatar = lastMessageYour === true
              lastMessageYour = true
              return (
                <div key={item._id}>
                  {displayAvatar ? null : (<Divider inset={true} />) }
                  <ListItem key={i}
                    leftAvatar={
                      displayAvatar ? <div />
                      : this.renderAvatar(cgAvatar, cgName)
                    }
                      primaryText={item.message} />
                </div>
              )
            } else {
              const displayAvatar = lastMessageYour === false
              lastMessageYour = false
              return (
                <div key={item._id}>
                  {displayAvatar ? null : (<Divider inset={true} />)}
                  <ListItem key={i}
                    rightAvatar={
                      displayAvatar ? <div />
                      : this.renderAvatar(cdAvatar, cdName)
                    }
                    primaryText={item.message}
                    style={{
                      textAlign: 'right',
                    }}
                  />
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
  var handle = Meteor.subscribe("Chat", cdUserId);
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
