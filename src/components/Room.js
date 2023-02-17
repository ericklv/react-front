import React, {useState} from 'react'
import Register from "./Register";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import Contacts from "./Contacts";
import Conversation from "./Conversation";

let stompClient = null;
const serverURL = 'http://localhost:8080';
let userData_ = {
    username: '',
    phone: '',
    receiver: '',
    connected: false,
    content: ''
}

const Room = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState(userData_);

    // useEffect(() => {
    //     let dataRaw = sessionStorage.getItem("userData");
    //     if(dataRaw!== null) {
    //         setUserData(JSON.parse(dataRaw))
    //         connect()
    //     }
    //     console.log(userData)
    // }, []);

    const changeTab = _ => {
        setTab(_)
    }
    const connect = () => {
        let Sock = new SockJS(serverURL + '/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/group/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        let chatMessage = {
            sender: userData.username,
            date: new Date(),
            type: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const disconnectSocket = () => {
        null !== stompClient && stompClient.disconnect();
        setUserData(userData_)
    }

    const onMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.type) {
            case "JOIN":
                if (!privateChats.get(payloadData.sender)) {
                    privateChats.set(payloadData.sender, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload) => {
        let payloadData = JSON.parse(payload.body);

        if (privateChats.get(payloadData.sender)) {
            privateChats.get(payloadData.sender).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.sender, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData, "message": value});
    }
    const sendValue = () => {
        if (stompClient) {
            let chatMessage = {
                sender: userData.username,
                content: userData.message,
                date: new Date(),
                type: "MESSAGE"
            };

            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    }

    const sendPrivateValue = () => {
        if (stompClient) {
            let chatMessage = {
                sender: userData.username,
                receiver: tab,
                content: userData.message,
                date: new Date(),
                type: "MESSAGE"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/peer-to-peer", {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""});
        }
    }

    const handleUsername = (event) => {
        const {value} = event.target;
        setUserData({...userData, "username": value});
    }

    const registerUser = () => {
        // sessionStorage.setItem("userData", JSON.stringify(userData))
        connect();
    }
    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <Contacts
                        privateChats={privateChats}
                        changeTab={changeTab}
                        tab={tab}
                    />
                    {tab === "CHATROOM" ?
                        <Conversation
                            userData={userData}
                            sendValue={sendValue}
                            chats={publicChats}
                            handleMessage={handleMessage}
                        /> :
                        <Conversation
                            userData={userData}
                            sendValue={sendPrivateValue}
                            chats={privateChats.get(tab)}
                            handleMessage={handleMessage}
                        />
                    }
                </div>
                :
                <Register
                    registerUser={registerUser}
                    handleUsername={handleUsername}
                />}
        </div>
    )
}

export default Room
