import React from 'react';
import '../css/ChatBubble.css';
import { Panel } from 'react-bootstrap';
import '../css/chat.css';
import '../css/chat.scss';

class ChatInput extends React.Component {

  render() {
    return (
        <Panel eventKey="1">
                <Panel.Heading>
                    <Panel.Title toggle>Conversation</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <textarea
                     id='chatTextArea'
                     value={this.props.input}
                     onChange={this.props.handleChange}
                     />
                </Panel.Body>
        </Panel>
    );
  }
};

export default ChatInput;