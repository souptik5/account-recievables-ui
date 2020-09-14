import React, { Component } from 'react';
import './professor.css';
import axios from 'axios';
import avatar from '../assets/avatar.svg';
import voice from '../assets/voiceIcon.svg';
import send from '../assets/send-24px.svg';

export class Professor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMessage: '',
      conversation: [],
      response: [],
      temp: '',
    };
  }
  handleChange = (event) => {
    this.setState({ userMessage: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.userMessage.trim()) return;

    const msg = {
      text: this.state.userMessage,
    };

    this.setState({
      conversation: [...this.state.conversation, msg],
    });

    axios
      .post('http://localhost:4000/chat', { message: this.state.userMessage })
      .then((res) => {
        this.setState({
          temp: res.data.message,
        });
      });

    this.setState({
      userMessage: '',
    });
    setTimeout(() => {
      const msg = {
        text: this.state.temp,
      };
      this.setState({
        response: [...this.state.response, msg],
      });
      console.log(this.state.response);
    }, 2000);
    console.log(this.state.conversation);
  };

  render() {
    const ChatBubble = (text, i, className) => {
      return (
        <div key={`${className}-${i}`} className={`${className} chat-bubble`}>
        <img
        src={avatar}
        alt='voice'
        style={{ height: '32px', width: '32px' }}
      />
          <span className='chat-content'>{text}</span>
        </div>
      );
    };
    const ChatBubble2 = (text, i, className) => {
      return (
        <div key={`${className}-${i}`} className={`${className} chat-bubble2`}>
          <span className='chat-content2'>{text}</span>
          <img
            src={voice}
            alt='voice'
            style={{
              height: '32px',
              width: '32px',
              transform: 'rotateY(180deg)',
            }}
          />
          
        </div>
      );
    };

    const chat = this.state.conversation.map((e, index) =>
      ChatBubble(e.text, index, e.user)
    );
    const chat2 = this.state.response.map((e, index) =>
      ChatBubble2(e.text, index, e.user)
    );
    return (
      <div style={{ border: '2px solid orange', backgroundColor: '#1B1F38', }}>
        <div
          className='close-bot'
          onClick={this.props.Click}
          autoid='professor-close-button'
        >
          <div className='bar'></div>
          <div className='bar'></div>
        </div>
        <div
          className='chat-window'
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex' }} className='chatBox'>
            <div className='conversation-view' autoid='human'>
              {chat}
            </div>
            <div className='conversation-view' autoid='ai'>
              {chat2}
            </div>
          </div>
          <div className='message-box'>
            <form onSubmit={this.handleSubmit} className='input_button'>
              <input
                value={this.state.userMessage}
                onInput={this.handleChange}
                className='text-input'
                type='text'
                autoFocus
                placeholder='Type here...'
                autoid='professor-input-box'
              />
              <button
                type='submit'
                autoid='professor-send-button'
                style={{
                  backgroundColor: '#1B1F38',
                  outline: 'none',
                  border: 'none',
                }}
              >
                <img src={send} alt='send' />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Professor;