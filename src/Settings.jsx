import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai"
import { Avatar, Row, Col, Button, Input, Modal, Popover } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import avatar from './images/jerry.jpg'
import './css/Settings.css'
import { addAvatarUrl2UserDb, getAvatarFromStorage, getUserNameByUserEmail, saveUserInfo, updateDisplayName, auth, readUserInfoByEmail } from "./utils/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import "antd/dist/antd.min.css";

function Settings() {
    // get current user
    const user = auth.currentUser
    let currentUserEmail = ''
    // let currentUserDisplayName = ''
    if(user !== null) {
        console.log('current user', user)
        currentUserEmail = user.email
        // currentUserDisplayName = user.
    }

    let authedUserName = ''
    try {
        // get user email from Login
        // console.log('location.state.userEmail', location.state.userEmail)
        const username = getUserNameByUserEmail(currentUserEmail)
        username.then((result) => {
            authedUserName = result
            console.log("username got from firebase", authedUserName)
            document.getElementById('username').innerHTML = result
            document.getElementById('username2').innerHTML = result
        }).catch(error => console.log(error))
    } catch (error) {

    }

    // read all userinfo
    const getUserInfo = async () => {
        return readUserInfoByEmail(currentUserEmail).then(res => {
            return res
        })
    }

    const [defaultInfo, setDefaultInfo] = useState({
        firstName: '',
        familyName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        postcode: ''
    })
    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const i = await getUserInfo()
                // console.log('i', i)
                setDefaultInfo({
                    firstName: i.firstName,
                    familyName: i.familyName,
                    phone: i.phone,
                    addressLine1: i.address.addressLine1,
                    addressLine2: i.address.addressLine2,
                    addressLine3: i.address.addressLine3,
                    postcode: i.postcode
                })
            } catch (error) {
                console.log('read user info erro', error.message)
            }
        }

        loadUserInfo()
    }, [])



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
            if (i === 2) continue
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
            if (i === 2) continue
            inputs[i].disabled = true
            inputs[i].style.color = 'grey'
            inputs[i].style.backgroundColor = '#fff'
            inputs[i].style.borderBottom = 'none'
            // inputs[i].value = ''
        }
        setInfo({
            firstName: '',
            familyName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            postcode: ''
        })
    }

    // upload new user info to firebase
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            await saveUserInfo(currentUserEmail, firstName, familyName, phone, postcode, { addressLine1, addressLine2, addressLine3 })
        } catch (error) {
            console.log("create user info error:", error.message)
        }
        document.getElementById('save-btn').style.display = 'none'
        document.getElementById('cancel-btn').style.display = 'none'
        document.getElementById('edit-btn').style.display = 'inline-block'
        const inputs = document.getElementsByClassName('inputs')
        for (var i = 0; i < inputs.length; i++) {
            if (i === 2) continue
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
            await updateDisplayName(currentUserEmail, newUsername)
        } catch (error) {
            console.log("change username failed:", error.message)
        }
    }

    // const [imageInfo, setImageInfo] = useState();
    // let avatarUrl = ''
    // let defaultAvatar = ''
    // const uploadAvatar2Fb = async () => {
    //     console.log("image got: ", loggedUserEmail, imageInfo)
    //     try {
    //         avatarUrl = addAvatarUrl2UserDb(loggedUserEmail, imageInfo)
    //         console.log('new avatar', avatarUrl)
    //         // document.getElementById('').setAttribute('src', avatarUrl)
    //     } catch (error) {
    //         console.log("upload error")
    //     }
    // }

    // getAvatarFromStorage(loggedUserEmail).then((url) => {
    //     defaultAvatar = url
    //     // console.log("defaultAvatar", defaultAvatar)
    // })

    // navigation
    const navigate = useNavigate()

    // const text = <span>Title</span>;
    const content = (
        <div>
            {/* <p>Content</p> */}
            {/* <p>Content</p> */}
            <Button type='primary' onClick={() => {
                auth.signOut().then(() => {
                    navigate('/login')
                }).catch((error) => {
                    console.log('sign out failed', error.message)
                })
            }}>Sign out here</Button>
        </div>
    )

    return (
        <div className="settings">
            <Row className="top">
                <Col span={10} className="icon">
                    <AiOutlineHome id="icon" onClick={() => navigate('/', {
                        state: {
                            userEmail: currentUserEmail,
                            username: authedUserName
                        }
                    })} style={{
                        color: '#6dabe4',
                        verticalAlign: 'middle',
                    }}
                    />
                    <label>Hello, <span id='username'>xxx</span></label>
                </Col>
                <Col span={12}></Col>
                <Col span={2} className='avatar'>
                    <Popover placement="bottom" content={content} trigger="click">
                        <Avatar size={80} id="topAvatar" src={avatar} />
                    </Popover>

                    {/* <img src={defaultAvatar}  /> */}
                </Col>
            </Row>

            <div className="detail">
                <div className="profile">
                    {/* <Avatar shape="square" id="largeAvatar" size={120} src={defaultAvatar} /> */}
                    {/* <img src={defaultAvatar} /> */}
                    <div className="set">
                        <p id="username2">xxx</p>
                        {/* change avatar */}
                        <Button type="primary" style={{ width: '180px' }} onClick={() => setAvatarModalOpen(true)}>Change Aavatar</Button>
                        {/* <Modal
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
                        </Modal> */}

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
                            <Input onChange={handleChange} value={info.firstName} name='firstName' disabled type='text' placeholder={defaultInfo.firstName} className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                        <Col span={12}>
                            <label className="labels">Family Name:</label>
                            <Input onChange={handleChange} value={info.familyName} name='familyName' disabled type='text' placeholder={defaultInfo.familyName} className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                    </Row>
                    <Row className="contact">
                        <Col span={12}>
                            <label className="labels">Email:</label>
                            <Input disabled type='text' placeholder={currentUserEmail} className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                        <Col span={12}>
                            <label className="labels">Phone Number:</label>
                            <Input onChange={handleChange} value={info.phone} name='phone' disabled type='text' placeholder={defaultInfo.phone} className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                    </Row>
                    <Row className="address">
                        <Col span={24}>
                            <label className="labels">Address:</label>
                            <Input onChange={handleChange} value={info.addressLine1} name='addressLine1' disabled type='text' placeholder={defaultInfo.addressLine1} className="inputs" style={{ marginLeft: '10px' }} />
                        </Col>
                        <Col span={24}>
                            <Input onChange={handleChange} value={info.addressLine2} name='addressLine2' disabled placeholder={defaultInfo.addressLine2} id="adds" type='text' className="inputs" />
                        </Col>
                        <Col span={24}>
                            <Input onChange={handleChange} value={info.addressLine3} name='addressLine3' disabled placeholder={defaultInfo.addressLine3} id="adds" type='text' className="inputs" />
                            <Input onChange={handleChange} value={info.postcode} name='postcode' disabled placeholder={defaultInfo.postcode} id="adds" type='text' className="inputs" style={{ width: '15%', marginLeft: '15px' }} />
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