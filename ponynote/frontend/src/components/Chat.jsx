import React, { Component } from 'react';
import {connect} from 'react-redux';
import {chats} from "../actions";
import ChatList from './ChatList';
import ChatInput from './ChatInput';
import { PanelGroup } from 'react-bootstrap';
import socketIOClient from "socket.io-client";


class Chat extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleChatAreaKeyPress = this.handleChatAreaKeyPress.bind(this);
    this.handleDefaultKeyPress = this.handleDefaultKeyPress.bind(this);
    this.addMessageRealTime = this.addMessageRealTime.bind(this);
  }

  addMessageRealTime(message) {
    console.log(message);
    if(message.id !== this.props.randomId) {
      this.props.addMessageRealTime(message.message);
    }
  }

  componentDidMount() {
    const endpoint = "http://127.0.0.1:4001";
    const socket = socketIOClient(endpoint);
    socket.on('send:message', this.addMessageRealTime);
    this.props.fetchChats();
    document.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleChange(event) {
    let value = event.target.value;
    this.props.changeChatInput(value);
  }

  handleKeyUp(event) {
    if (event.keyCode === 16) {
        this.props.changeShiftPressed(false);
    }
  }

  handleChatAreaKeyPress(event) {
    if (event.keyCode === 16) {
        this.props.changeShiftPressed(true);
    }
    if (event.keyCode === 13 && !this.props.shiftPressed) {
      this.props.submitNewMessage(this.props.input, this.props.randomId);
    }
  }
  handleDefaultKeyPress(event) {
    return;
  }

  handleKeyPress(event) {
    let functions = {chatTextArea: this.handleChatAreaKeyPress};
    let result = functions[event.target.id] || this.handleDefaultKeyPress;
    return result(event);
  }

  submitMessage(event) {
    event.preventDefault();
    this.props.submitNewMessage(this.props.input, this.props.randomId);
  }

  render() {
    return (
      <div>
        <h2>Chat Room</h2>
        <PanelGroup accordion id="accordion-example">
            <ChatInput input={this.props.input} handleChange={this.handleChange} key="chat_input"></ChatInput>
            <ChatList editMessage={this.props.editMessage} deleteMessage={this.props.deleteMessage}
                messages={this.props.messages} randomId={this.props.randomId}
                key="chat_list"
                deleteMessageRealTime={this.props.deleteMessageRealTime}></ChatList>
         </PanelGroup>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    randomId: state.chats.randomId,
    messages: state.chats.messages,
    auth: state.auth,
    input: state.chats.input,
    shiftPressed: state.chats.shiftPressed
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteMessageRealTime: (index, id, randomId) =>{
      dispatch(chats.deleteMessageRealTime(index, id, randomId));
    },
    addMessageRealTime: (message) => {
        dispatch(chats.addMessageRealTime(message));
    },
    submitNewMessage: (message, randomId) => {
      dispatch(chats.addMessage(message, randomId))
    },
    changeChatInput: (input) => {
        dispatch(chats.changeInput(input));
    },
    changeShiftPressed: (shiftPressed) => {
        dispatch(chats.changeShiftPressed(shiftPressed));
    },
    editMessage: (index, message, id, user, created_at) => {
        dispatch(chats.editMessage(index, message, id, user, created_at));
    },
    deleteMessage: (index, id) => {
        dispatch(chats.deleteMessage(index, id));
    },
    fetchChats: () => {
        dispatch(chats.fetchChats());
    },
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Chat);
