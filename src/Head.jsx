import React from "react";
import { Link } from "react-router-dom";
import deakinLogo from './images/deakin-logo.jpg'
import { Row, Col, Input } from 'antd'
import './css/Head.css'
import "antd/dist/antd.min.css";

function Auth(props) {
    const { Search } = Input
    const onSearch = (value) => console.log(value);

    console.log("authed: ", props.authed)
    

    return (
        <div className="head">
            <Row className="menu">
                <Col span={4} className="logo">
                    <img src={deakinLogo} alt='deakin-logo' />
                    <label>DEV@DEAKIN</label>
                </Col>
                <Col span={8} className='col'>
                    {/* <p className="link">Post</p> */}
                </Col>
                <Col span={8} className='col'>
                    <Search
                        placeholder="input search text"
                        allowClear
                        onSearch={onSearch}
                        className='search'
                    />
                </Col>
                <Col span={4} className='col' id="unauth">
                    <p className="link" id="login"><Link to='/login'>Login</Link></p>
                    <p className="link" id="signup"><Link to='/signup'>Signup</Link></p>
                </Col>
            </Row>
        </div>
    )

}

export default Auth