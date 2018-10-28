import React from 'react';
import '../css/ChatBubble.css';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class ChatMessage extends React.Component {
   constructor(props) {
     super(props);
   }

  render() {
    return (
        <div className={'bubble-container ' + this.props.bubbleDirection} key={this.props.index}>
            <div className={'bubble ' + this.props.bubbleClass}>
                {this.props.message}
            </div>
        </div>
    );
  }
};

export default ChatMessage;