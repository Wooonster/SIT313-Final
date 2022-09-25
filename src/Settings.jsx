import React, { useState } from "react";
import { AiOutlineHome } from "react-icons/ai"
import { Avatar, Row, Col, Button, Input, Modal } from "antd";
import { UploadOutlined } from '@ant-design/icons';
// import avatar from './images/jerry.jpg'
import './css/Settings.css'
import { addAvatarUrl2UserDb, getAvatarFromStorage, getUserNameByUserEmail, saveUserInfo, updateDisplayName } from "./utils/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import "antd/dist/antd.min.css";

function Settings() {
    const location = useLocation()
    let authedUserName = ''
    try {
        // get user email from Login
        // console.log('location.state.userEmail', location.state.userEmail)
        const username = getUserNameByUserEmail(location.state.userEmail)
        username.then((result) => {
            authedUserName = result
            console.log("username got from firebase", authedUserName)
            document.getElementById('username').innerHTML = result
            document.getElementById('username2').innerHTML = result
        }).catch(error => console.log(error))
    } catch (error) {

    }

    // initialize new user info
    const [info, setInfo] = useState({
        firstName: '',
        familyName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        postcode: ''
    })
    const { firstName, familyName, phone, addressLine1, addressLine2, addressLine3, postcode } = info
    console.log('user info setted: ', info)

    // set new user info
    const handleChange = (event) => {
        const { name, value } = event.target
        setInfo((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }

    // 变换按钮
    const change2Save = () => {
        document.getElementById('edit-btn').style.display = 'none'
        document.getElementById('cancel-btn').style.display = 'inline-block'
        document.getElementById('save-btn').style.display = 'inline-block'
        const inputs = document.getElementsByClassName('inputs')
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = false
            inputs[i].style.color = '#000'
            inputs[i].style.borderBottom = '4px solid #6dabe4'
        }
    }

    const cancelEditing = () => {
        document.getElementById('edit-btn').style.display = 'inline-block'
        document.getElementById('cancel-btn').style.display = 'none'
        document.getElementById('save-btn').style.display = 'none'
        const inputs = document.getElementsByClassName('inputs')
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true
            inputs[i].style.color = 'grey'
            inputs[i].style.backgroundColor = '#fff'
            inputs[i].style.borderBottom = 'none'
        }
    }

    // upload new user info to firebase
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            await saveUserInfo(firstName, familyName, phone, postcode, { addressLine1, addressLine2, addressLine3 })
        } catch (error) {
            console.log("create user info error:", error.message)
        }
        document.getElementById('save-btn').style.display = 'none'
        document.getElementById('edit-btn').style.display = 'inline-block'
        const inputs = document.getElementsByClassName('inputs')
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true
            inputs[i].style.color = 'grey'
            inputs[i].style.backgroundColor = '#fff'
            inputs[i].style.borderBottom = 'none'
        }
    }

    // Modal hook
    const [modalOpen, setModalOpen] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);

    // change name
    const [newUsername, setNewUsername] = useState('')
    const changeUsername = async () => {
        try {
            await updateDisplayName(location.state.userEmail, newUsername)
        } catch (error) {
            console.log("change username failed:", error.message)
        }
    }

    const [imageInfo, setImageInfo] = useState();
    let avatarUrl = ''
    let defaultAvatar = ''
    const uploadAvatar2Fb = async () => {
        console.log("image got: ", location.state.userEmail, imageInfo)
        try {
            avatarUrl = addAvatarUrl2UserDb(location.state.userEmail, imageInfo)
            console.log('new avatar', avatarUrl)
            // document.getElementById('').setAttribute('src', avatarUrl)
        } catch (error) {
            console.log("upload error")
        }
    }
    
    getAvatarFromStorage(location.state.userEmail).then((url) => {
        defaultAvatar = url
        // console.log("defaultAvatar", defaultAvatar)
    })

    // navigation
    const navigate = useNavigate()

    return (
        <div className="settings">
            <Row className="top">
                <Col span={10} className="icon">
                    <AiOutlineHome id="icon" onClick={() => navigate('/', {
                        state: {
                            userEmail: location.state.userEmail
                        }
                    })} style={{
                        verticalAlign: 'middle',
                    }}
                    />
                    <label>Hello, <span id='username'>xxx</span></label>
                </Col>
                <Col span={10}></Col>
                <Col span={4} className='avatar'>
                    <Avatar size={100} id="topAvatar" src={defaultAvatar} />
                    {/* <img src={defaultAvatar}  /> */}
                </Col>
            </Row>

            <div className="detail">
                <div className="profile">
                    <Avatar shape="square" id="largeAvatar" size={120} src={defaultAvatar} />
                    {/* <img src={defaultAvatar} /> */}
                    <div className="set">
                        <p id="username2">xxx</p>
                        {/* change avatar */}
                        <Button type="primary" style={{ width: '180px' }} onClick={() => setAvatarModalOpen(true)}>Change Aavatar</Button>
                        <Modal
                            title="Change Aavatar"
                            centered
                            open={avatarModalOpen}
                            onOk={() => {
                                uploadAvatar2Fb()
                                setAvatarModalOpen(false)
                            }}
                            onCancel={() => setAvatarModalOpen(false)} >
                            <Button
                                type="primary"
                                onClick={() => {
                                    document.getElementById('broswer').click()
                                }} icon={<UploadOutlined />}>Change Avatar</Button>
                            <input
                                type="file"
                                id="broswer"
                                // className=".hide_file"
                                // placeholder="Choose Files"
                                onChange={
                                    (event) => {
                                        // setImageUpload(event.target.files[0]);
                                        // console.log('event.target.files: ', event.target.files)
                                        setImageInfo(event.target.files[0])
                                    }}
                                hidden
                            />
                        </Modal>

                        {/* change name */}
                        <Button type="primary" onClick={() => setModalOpen(true)}>Change Name</Button>
                        <Modal
                            title="Change Username"
                            centered
                            open={modalOpen}
                            onOk={() => {
                                setModalOpen(false)
                                changeUsername()
                            }}
                            onCancel={() => setModalOpen(false)} >
                            <p>Set your new username below...</p>
                            <input placeholder="set your new name" type='text' onChange={(e) => setNewUsername(e.target.value)} value={newUsername} style={{
                                width: '80%',
                                height: '35px',
                                borderBottom: '3px solid #6dabe4',
                                borderTop: '0px',
                                borderLeft: '0px',
                                borderRight: '0px',
                                fontSize: '18px',
                                outline: 'none'
                            }} />
                        </Modal>
                    </div>
                </div>
                <div className="basic-info">
                    <p>Basic Personnal Infomation</p>
                    <Row className="names">
                        <Col span={12}>
                            <label className="labels">First Name:</label>
                            <Input onChange={handleChange} value={info.firstName} name='firstName' disabled type='text' placeholder="Fangzhou" className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                        <Col span={12}>
                            <label className="labels">Family Name:</label>
                            <Input onChange={handleChange} value={info.familyName} name='familyName' disabled type='text' placeholder="Wang" className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                    </Row>
                    <Row className="contact">
                        <Col span={12}>
                            <label className="labels">Email:</label>
                            <Input disabled type='text' placeholder="s222187008@deakin.edu.au" className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                        <Col span={12}>
                            <label className="labels">Phone Number:</label>
                            <Input onChange={handleChange} value={info.phone} name='phone' disabled type='text' placeholder="0493521881" className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                    </Row>
                    <Row className="address">
                        <Col span={24}>
                            <label className="labels">Address:</label>
                            <Input onChange={handleChange} value={info.addressLine1} name='addressLine1' disabled placeholder="221 Burwood Hwy" type='text' className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                        <Col span={24}>
                            <Input onChange={handleChange} value={info.addressLine2} name='addressLine2' disabled placeholder="Burwood" id="adds" type='text' className="inputs" />
                        </Col>
                        <Col span={24}>
                            <Input onChange={handleChange} value={info.addressLine3} name='addressLine3' disabled placeholder="VIC" id="adds" type='text' className="inputs" />
                            <Input onChange={handleChange} value={info.postcode} name='postcode' disabled placeholder="3125" id="adds" type='text' className="inputs" style={{ width: '15%', marginLeft: '15px' }} />
                        </Col>
                    </Row>
                    <Row justify="end" className="edit">
                        <Col span={6}>
                            <Button type="primary" id="edit-btn" className="btn" onClick={change2Save}>Edit Info</Button>
                            <Button type="primary" danger id="cancel-btn" className="btn" onClick={cancelEditing} style={{ display: 'none' }}>Cancel</Button>
                            <Button type="primary" id="save-btn" className="btn" onClick={handleSubmit} style={{ display: 'none' }}>Save Info</Button>
                        </Col>
                    </Row>
                </div>
                <div className="social"></div>
            </div>
        </div>
    )
}

export default Settings