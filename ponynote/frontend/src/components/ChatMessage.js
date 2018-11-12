import React from 'react';
import '../css/ChatBubble.css';
import { Grid, Row, Col, Image, Button} from 'react-bootstrap';
import Textarea from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import '../css/chat.css';
import '../css/chat.scss';
import socketIOClient from "socket.io-client";

class ChatMessage extends React.Component {
   constructor(props) {
     super(props);
     this.handleChange = this.handleChange.bind(this);
     this.deleteMessage = this.deleteMessage.bind(this);
     this.handleBlur = this.handleBlur.bind(this);
     this.deleteMessageRealTime = this.deleteMessageRealTime.bind(this);
   }
   shouldComponentUpdate(nextProps) {
        return (nextProps.message !== this.props.message);
   }
    componentDidMount() {
        const endpoint = "http://127.0.0.1:4001";
        const socket = socketIOClient(endpoint);
        socket.on('disconnect', (reason) => {
            console.log(reason);
            if (reason === 'transport close') {
                socket.connect();
            }
        });
        socket.on('delete:message', this.deleteMessageRealTime);
    }
    deleteMessageRealTime(data){
        this.props.deleteMessageRealTime(data.index, data.id, this.props.randomId);
    }
    handleBlur(event) {
        const endpoint = "http://127.0.0.1:4001";
        const socket = socketIOClient(endpoint);
        socket.emit('send:message', {randomId: this.props.randomId, message: this.props.message});
    }

    handleChange(event) {
        let value = event.target.value;
        this.props.editMessage(this.props.index, value, this.props.message.id, 
                               this.props.message.receiver, this.props.message.created_at);
    }
   deleteMessage(event) {
        event.preventDefault();
        this.props.deleteMessage(this.props.index, this.props.message.id);
   }

  render() {
    return (
        <div className={'bubble-container ' + this.props.bubbleDirection} key={this.props.message.id}>
            <Grid>
                <Row>
                    <div>
                        <span className="message-data-name"><FontAwesomeIcon icon={faCircle} /> {this.props.message.receiver.username} </span>
                        <span className="message-data-time">{this.props.message.created_at}</span>
                    </div>
                </Row>
                <Row>
                    <Col xs={2} md={2}>
                        <Image src="https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg?cs=srgb&dl=attractive-beautiful-beautiful-girl-458766.jpg&fm=jpg" thumbnail />
                    </Col>
                    <Col xs={8} md={8}>
                        <Textarea key={this.props.message.id} value={this.props.message.text} onChange={this.handleChange} onBlur={this.handleBlur}></Textarea>
                    </Col>
                    <Col xs={1} md={1}>
                        <Button bsStyle="danger" onClick={this.deleteMessage}><i><FontAwesomeIcon icon={faTrash} /></i></Button>
                    </Col>
                </Row>
            </Grid>
       </div>
    );
  }
};




export default ChatMessage;