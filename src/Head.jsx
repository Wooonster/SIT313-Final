import React, { useContext } from "react";
import { Link } from "react-router-dom";
import deakinLogo from './images/deakin-logo.jpg'
import { Row, Col, Input } from 'antd'
import './css/Head.css'
import "antd/dist/antd.min.css";
import { SearchContext } from "./Context/search.context";

const { Search } = Input;

function Auth(props) {
    const {searchTerm, setSearchTerm} = useContext(SearchContext)

    let authedEmail = props.authed
    console.log("authed: ", authedEmail)

    const authedReturn = () => {
        if (authedEmail !== null) {
            return (
                <Col span={4} className='col'>
                    <p className="link" id="post"><Link to='/post' state={authedEmail}>POST</Link></p>
                    <p className="link" id="settings" ><Link to='/settings'>settings</Link></p>
                </Col>
            )
        }
        else {
            return (
                <Col span={4} className='col' id="unauth">
                    <p className="link" id="login"><Link to='/login'>Login</Link></p>
                    <p className="link" id="signup"><Link to='/signup'>Signup</Link></p>
                </Col>
            )
        }
    }

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
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                        }}
                        value={searchTerm}
                        className='search'
                        enterButton
                    />
                </Col>

                {authedReturn()}
            </Row>

            
        </div>
    )

}

export default Auth