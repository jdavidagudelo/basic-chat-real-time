import React, { Component } from 'react';
import {connect, Provider} from 'react-redux';
import { createStore } from 'redux';
import {chats} from "../actions";
import ChatMessage from './ChatMessage';
import messageReducer from '../reducers/chats';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook } from '@fortawesome/free-solid-svg-icons'
import { PanelGroup } from 'react-bootstrap';
import { Panel, Form, FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap'


class Presentational extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
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

  handleKeyPress(event) {
    if (event.keyCode === 16) {
        this.props.changeShiftPressed(true);
    }
    if (event.keyCode === 13 && !this.props.shiftPressed) {
      this.props.submitNewMessage(this.props.input);
    }
  }

  submitMessage(event) {
    event.preventDefault();
    this.props.submitNewMessage(this.props.input);
  }

  render() {
    return (
      <div>
        <h2>Chat Room</h2>
        <div>

        </div>
        <PanelGroup accordion id="accordion-example">
            <Panel eventKey="1">
                <Panel.Heading>
                    <Panel.Title toggle>Conversation</Panel.Title>
                </Panel.Heading>
                <Panel.Body >
                    <textarea
                     value={this.props.input}
                     onChange={this.handleChange}
                     />
                </Panel.Body>
            </Panel>
            <Panel eventKey="2">
                <Panel.Heading>
                    <Panel.Title toggle>Conversation</Panel.Title>
                </Panel.Heading>
                <Panel.Body >
                {
                    this.props.messages.map( (message, index) => {
                    let bubbleClass = index % 2? 'bubble me': 'bubble you';
                    let bubbleDirection = index % 2? 'bubble-container bubble-direction-reverse': 'bubble-container bubble-direction';
                    return (
                        <ChatMessage message={message} index={index} bubbleDirection={bubbleDirection}
                        bubbleClass={bubbleClass}/>
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
    messages: state.messages,
    input: state.input,
    shiftPressed: state.shiftPressed
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitNewMessage: (message) => {
      dispatch(chats.addMessage(message))
    },
    changeChatInput: (input) => {
        dispatch(chats.changeInput(input));
    },
    changeShiftPressed: (shiftPressed) => {
        dispatch(chats.changeShiftPressed(shiftPressed));
    }
  }
};

const store = createStore(messageReducer);
const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

class ChatRoom extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container/>
      </Provider>
    );
  }
};

export default ChatRoom;