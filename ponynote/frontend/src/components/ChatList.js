import React from 'react';
import '../css/ChatBubble.css';
import ChatMessage from './ChatMessage';
import { Panel } from 'react-bootstrap';
import '../css/chat.css';
import '../css/chat.scss';


class ChatList extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (nextProps.messages !== this.props.messages);
    }
  render() {
    return (
            <Panel eventKey="2" >
                <Panel.Heading>
                    <Panel.Title toggle>Messages</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                {
                    this.props.messages.map( (message, index) => {
                    let bubbleClass = index % 2? 'bubble me': 'bubble you';
                    let bubbleDirection = index % 2? 'bubble-container bubble-direction-reverse': 'bubble-container bubble-direction';
                    return (
                        <ChatMessage message={message} id={message.id} bubbleDirection={bubbleDirection}
                         index={index} bubbleClass={bubbleClass} key={message.id} createdAt={message.created_at}
                         editMessage={this.props.editMessage} user={message.receiver}
                         randomId={this.props.randomId}
                         deleteMessageRealTime={this.props.deleteMessageRealTime}
                         deleteMessage={this.props.deleteMessage}/>
                    );
                  })
                }
                </Panel.Body>
            </Panel>
    );
  }
};

export default ChatList;