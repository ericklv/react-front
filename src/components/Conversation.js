import React from "react";
import { Input, Button} from 'antd';

const { Search } = Input;
const Conversation = (props) => {
    const {userData, sendValue, chats, handleMessage} = props;

    return <div className="chat-content">
        <ul className="chat-messages">
            {chats.map((chat, index) => (
                <li className={`message ${chat.sender === userData.username && "self"}`} key={index}>
                    {chat.sender !== userData.username &&
                        <div className="avatar">{chat.sender}</div>}
                    <div className="chat-item">
                        <div className="message-data">{chat.content}</div>
                        <div className="message-data">{new Date(chat.date).toLocaleTimeString([], {timeStyle: 'short'})}</div>
                    </div>
                    {chat.sender === userData.username && <div className="avatar self">{chat.sender}</div>}
                </li>
            ))}
        </ul>

        <div className="send-message">
            <input type="text" className="input-message" placeholder="enter the message" value={userData.message}
                   onChange={handleMessage}/>
            <Button shape="circle" onClick={sendValue}>=></Button>
        </div>
    </div>
}
export default Conversation;
