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
     this.state = {message: this.props.message};
     this.handleChange = this.handleChange.bind(this);
     this.deleteMessage = this.deleteMessage.bind(this);
     this.handleBlur = this.handleBlur.bind(this);
     this.deleteMessageRealTime = this.deleteMessageRealTime.bind(this);
   }
    componentDidMount() {
        const endpoint = "http://127.0.0.1:4001";
        const socket = socketIOClient(endpoint);
        socket.on('delete:message', this.deleteMessageRealTime);
    }
    deleteMessageRealTime(data){
        this.props.deleteMessage(data.index, data.id);
    }
    handleBlur(event) {
        this.props.editMessage(this.props.index, this.state.message, this.props.id, this.props.user, this.props.createdAt);
    }

    handleChange(event) {
        let value = event.target.value;
        this.setState({message: value});
    }
   deleteMessage(event) {
        event.preventDefault();
        this.props.deleteMessage(this.props.index, this.props.id);
   }

  render() {
    return (
        <div className={'bubble-container ' + this.props.bubbleDirection} key={this.props.id}>
            <Grid>
                <Row>
                    <div>
                        <span className="message-data-name"><FontAwesomeIcon icon={faCircle} /> {this.props.user.username} </span>
                        <span className="message-data-time">{this.props.createdAt}</span>
                    </div>
                </Row>
                <Row>
                    <Col xs={2} md={2}>
                        <Image src="https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg?cs=srgb&dl=attractive-beautiful-beautiful-girl-458766.jpg&fm=jpg" thumbnail />
                    </Col>
                    <Col xs={8} md={8}>
                        <Textarea key={this.props.id} value={this.state.message} onChange={this.handleChange} onBlur={this.handleBlur}></Textarea>
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