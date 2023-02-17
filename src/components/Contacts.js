import {Avatar} from "antd";

const Contacts = props => {
    const {changeTab, privateChats, tab} = props
    return <div className="member-list">
        <ul>
            <li onClick={() => {
                changeTab("CHATROOM")
            }} className={`member ${tab === "CHATROOM" && "active"}`}><Avatar size={40}>G</Avatar> Group
            </li>
            {[...privateChats.keys()].map((name, index) => (
                <li onClick={() => {
                    changeTab(name)
                }} className={`member ${tab === name && "active"}`} key={index}><Avatar size={40}>{name[0].toUpperCase()}</Avatar> {name}</li>
            ))}
        </ul>
    </div>

}

export default Contacts

