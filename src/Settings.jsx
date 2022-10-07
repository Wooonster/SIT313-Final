import React, { useEffect, useState } from "react";
import { LogoutOutlined, DashboardOutlined, MailOutlined, DoubleLeftOutlined, CloseOutlined } from '@ant-design/icons'
import { Row, Col, Button, Input, Modal, Popover, Badge, Card } from "antd";
import './css/Settings.css'
import { getUserNameByUserEmail, saveUserInfo, updateDisplayName, auth, readUserInfoByEmail, readAllAriticles, readAllQuestions, getAllIds, changeReadCondition } from "./utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import "antd/dist/antd.min.css";
import MyCardList from "./MyCardList";
import { getDatabase, ref, onValue, get, update } from "firebase/database";
import Foot from "./Foot";

function Settings() {
    // get current user
    const user = auth.currentUser
    let currentUserEmail = ''
    // let currentUserDisplayName = ''
    if (user !== null) {
        // console.log('current user', user)
        currentUserEmail = user.email
    }

    let authedUserName = ''
    try {
        // get user email from Login
        // console.log('location.state.userEmail', location.state.userEmail)
        const username = getUserNameByUserEmail(currentUserEmail)
        username.then((result) => {
            authedUserName = result
            // console.log("username got from firebase", authedUserName)
            document.getElementById('username').innerHTML = result
            document.getElementById('username2').innerHTML = result
        }).catch(error => console.log(error))
    } catch (error) {
        console.log('get username error', error.message)
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
    // console.log('user info setted: ', info)

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

    // change name
    const [newUsername, setNewUsername] = useState('')
    const changeUsername = async () => {
        try {
            await updateDisplayName(currentUserEmail, newUsername)
        } catch (error) {
            console.log("change username failed:", error.message)
        }
    }

    // navigation
    const navigate = useNavigate()

    // const text = <span>Title</span>;
    const content = (
        <div>
            {/* <p>Content</p> */}
            {/* <p>Content</p> */}
            <Button type='primary'
                icon={<LogoutOutlined />}
                onClick={() => {
                    auth.signOut().then(() => {
                        navigate('/')
                    }).catch((error) => {
                        console.log('sign out failed', error.message)
                    })
                }}>Sign out here</Button>
        </div>
    )

    // notification count && notification box 
    const [notifiCount, setNotifiCount] = useState(0)
    const [notifications, setNotifications] = useState([])

    const mailboxContent = (
        <div className="mailbox">
            {notifications.map((comment, i) => (
                <Card size="small" title="Comment" extra={<p>{comment[3]}</p>} key={i} id={`notification${i}`} className='notification' >
                    <Link to='/detail' state={{ id: comment[0] }} id="post">{comment[1]}</Link>
                    <p id="comment">{comment[2]}</p>
                </Card>
            ))}
        </div>
    )

    useEffect(() => {
        var a = 0
        var ids = []
        readAllQuestions().then(res => {
            res.forEach(i => {
                onValue(ref(getDatabase(), `post-comments/${i[0]}/`), snapshot => {
                    if (snapshot.exists()) {
                        const data = Object.values(snapshot.val())
                        data.forEach(d => {
                            if (d.email === currentUserEmail && !d.isRead) {
                                a = a + 1
                                ids.push([i[0], i[1].title, d.comment, d.createTime])
                                setNotifiCount(a)
                                setNotifications(ids)
                            }
                        })
                    }
                })
            })
        })

        readAllAriticles().then(res => {
            res.forEach(i => {
                onValue(ref(getDatabase(), `post-comments/${i[0]}/`), snapshot => {
                    if (snapshot.exists()) {
                        const data = Object.values(snapshot.val())
                        data.forEach(d => {
                            if (d.email === currentUserEmail && !d.isRead) {
                                a = a + 1
                                ids.push([i[0], i[1].title, d.comment, d.createTime])
                                setNotifiCount(a)
                                setNotifications(ids)
                                // const updates = {}
                                // updates[`post-comments/${i[0]}/` + ]
                                // return update(ref(getDatabase()), updates)
                            }
                        })
                    }
                })
            })
        })
    }, [])


    return (
        <div className="settings">
            <Row className="top">
                <Col span={10} className="icon">
                    <DoubleLeftOutlined id="icon" onClick={() => navigate('/', {
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
                <Col span={11}></Col>
                <Col span={3} className='dash'>
                    <Badge count={notifiCount} offset={[-20, 5]}>
                        <Popover placement="rightBottom" content={mailboxContent} trigger='click'>
                            <MailOutlined id="icon" onClick={() => {
                                setNotifiCount(0)
                                changeReadCondition()
                            }} />
                        </Popover>
                    </Badge>
                    <Popover placement="bottom" content={content} trigger="click">
                        {/* <Avatar size={80} id="topAvatar" src={avatar} /> */}
                        <DashboardOutlined id="icon" />
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

                        {/* change name */}
                        <Button onClick={() => setModalOpen(true)}>Change Name</Button>
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
                <div >
                    <p className="title">My posts:</p>
                    <MyCardList email={currentUserEmail} className="mycard-list" />
                </div>
            </div>

            <Foot />
        </div>
    )
}

export default Settings