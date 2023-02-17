import React from "react";
import { Input } from 'antd';

const { Search } = Input;

const Register = props => {
const {handleUsername, registerUser} = props;

return <div className="register">
    <Search
        placeholder="Enter your name"
        allowClear
        onChange={handleUsername}
        enterButton="Create chat"
        size="large"
        onSearch={registerUser}
    />
</div>
}
export default Register
