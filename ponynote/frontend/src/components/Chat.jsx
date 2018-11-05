import React, { Component } from 'react';
import {connect, Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {chats} from "../actions";
import {auth} from "../actions";
import thunk from 'redux-thunk';
import ChatMessage from './ChatMessage';
import messageReducer from '../reducers/chats';
import { PanelGroup, Nav, Navbar, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import { Panel } from 'react-bootstrap';
import socketIOClient from "socket.io-client";


const store = createStore(messageReducer, applyMiddleware(thunk));

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
    this.props.addMessageRealTime(message);
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
      this.props.submitNewMessage(this.props.input);
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
    this.props.submitNewMessage(this.props.input);
  }

  render() {
    return (
      <div>
        <h2>Chat Room</h2>
        <PanelGroup accordion id="accordion-example">
            <Panel eventKey="1">
                <Panel.Heading>
                    <Panel.Title toggle>Conversation</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <textarea
                     id='chatTextArea'
                     value={this.props.input}
                     onChange={this.handleChange}
                     />
                </Panel.Body>
            </Panel>
            <Panel eventKey="2" >
                <Panel.Heading>
                    <Panel.Title toggle>Conversation</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                {
                    this.props.messages.map( (message, index) => {
                    let messageText = message.text || '';
                    let bubbleClass = index % 2? 'bubble me': 'bubble you';
                    let bubbleDirection = index % 2? 'bubble-container bubble-direction-reverse': 'bubble-container bubble-direction';
                    return (
                        <ChatMessage message={messageText} id={message.id} bubbleDirection={bubbleDirection}
                         index={index} bubbleClass={bubbleClass} key={message.id} createdAt={message.created_at}
                         editMessage={this.props.editMessage} user={message.receiver}
                         deleteMessage={this.props.deleteMessage}/>
                    );
                  })
                }
                </Panel.Body>
            </Panel>
         </PanelGroup>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    messages: state.chats.messages,
    auth: state.auth,
    input: state.chats.input,
    shiftPressed: state.chats.shiftPressed
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addMessageRealTime: (message) => {
        dispatch(chats.addMessageRealTime(message));
    },
    submitNewMessage: (message) => {
      dispatch(chats.addMessage(message))
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
