import React from 'react';
import '../css/ChatBubble.css';
import { Grid, Row, Col, Image, Button} from 'react-bootstrap';
import Textarea from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

class ChatMessage extends React.Component {
   constructor(props) {
     super(props);
     this.handleChange = this.handleChange.bind(this);
     this.deleteMessage = this.deleteMessage.bind(this);
   }

    handleChange(event) {
        let value = event.target.value;
        console.log(value);
        this.props.editMessage(this.props.index, value);
    }
   deleteMessage(event) {
        event.preventDefault();
        this.props.deleteMessage(this.props.index);
   }

  render() {
    return (
        <div className={'bubble-container ' + this.props.bubbleDirection} key={this.props.index}>
            <Grid>
                <Row>
                    <Col xs={2} md={2}>
                        <Image src="https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg?cs=srgb&dl=attractive-beautiful-beautiful-girl-458766.jpg&fm=jpg" thumbnail />
                    </Col>
                    <Col xs={8} md={8}>
                        <Textarea key={this.props.index} value={this.props.message} onChange={this.handleChange}></Textarea>
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