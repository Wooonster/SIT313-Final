import React, { useContext } from "react";
import { Link } from "react-router-dom";
import deakinLogo from './images/deakin-logo.jpg'
import { Row, Col, Input } from 'antd'
import './css/Head.css'
import "antd/dist/antd.min.css";
import { SearchContext } from "./Context/search.context";
import { SettingOutlined } from '@ant-design/icons'
import { auth, getUserNameByUserEmail } from "./utils/firebase";

const { Search } = Input;

function Head() {
    const {searchTerm, setSearchTerm} = useContext(SearchContext)

    let authedEmail = ''
    let authedUserName = ''
    
    const curUser = auth.currentUser
    // console.log('user from Head:', curUser)
    if(curUser !== null) {
        authedEmail = curUser.email
        authedUserName = getUserNameByUserEmail(authedEmail)
    }

    const authedReturn = () => {
        if (curUser !== null) {
            return (
                <Col span={4} className='col'>
                    <p className="link" id="post"><Link to='/post'>POST</Link></p>
                    <p className="link" id="plan"><Link to='/plan'>Go PRO</Link></p>
                    <p className="link" id="settings" ><Link to='/settings'><SettingOutlined /></Link></p>
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

export default Head