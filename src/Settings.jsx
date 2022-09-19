import React, { useState } from "react";
import { AiOutlineHome } from "react-icons/ai"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Row, Col, Button, Input, Modal, message, Upload } from "antd";
import avatar from './images/jerry.jpg'
import './css/Settings.css'
import { addAvatarUrl2UserDb, getUserNameByUserEmail, saveUserInfo, updateDisplayName } from "./utils/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import "antd/dist/antd.min.css";

// upload avatar
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

// 检查是否是jpg/png 检查是否小于2mb
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }

    return isJpgOrPng && isLt2M;
};


function Settings() {
    // get user email from Login
    const location = useLocation()
    console.log('location.state.userEmail', location.state.userEmail)
    const username = getUserNameByUserEmail(location.state.userEmail)
    username.then((result) => {
        console.log(result)
        document.getElementById('username').innerHTML = result
        document.getElementById('username2').innerHTML = result
    }).catch(error => console.log(error))

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
    console.log('info: ', info)

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
    const [modal1Open, setModal1Open] = useState(false);
    const [modal2Open, setModal2Open] = useState(false);

    // Upload new avatar
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadAvatar2fb = async () => {
        console.log('new avatar url: ', imageUrl)
        try {
            await addAvatarUrl2UserDb(location.state.userEmail, imageUrl)
        } catch (error) {
            console.log(error.message)
        }
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    // change name
    const [newUsername, setNewUsername] = useState('')
    const changeUsername = async () => {
        console.log("new username: ", newUsername)
        try {
            await updateDisplayName(location.state.userEmail, newUsername)
        } catch (error) {
            console.log("change username failed:", error.message)
        }
    }

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
                    <Avatar size={100} src={avatar} />
                </Col>
            </Row>

            <div className="detail">
                <div className="profile">
                    <Avatar shape="square" size={120} src={avatar} />
                    <div className="set">
                        <p id="username2">xxx</p>
                        {/* change avatar */}
                        <Button type="primary" onClick={() => setModal1Open(true)}>Change Avatar</Button>
                        <Modal
                            title="Upload your new avatar here"
                            centered
                            open={modal1Open}
                            onOk={() => setModal1Open(false)}
                            onCancel={() => setModal1Open(false)} >
                            <p>Click below to upload...</p>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                // 上传的地址
                                action='./images/'
                                // 检查是否为jpg/png 检查是否小于2mb
                                beforeUpload={beforeUpload}
                                // set new upload url
                                onChange={handleAvatarChange} >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="avatar"
                                        style={{
                                            width: '100%',
                                        }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Modal>
                        {/* change name */}
                        <Button type="primary" onClick={() => setModal2Open(true)}>Change Name</Button>
                        <Modal
                            title="Change Username"
                            centered
                            open={modal2Open}
                            onOk={() => {
                                setModal2Open(false)
                                changeUsername()
                            }}
                            onCancel={() => setModal2Open(false)} >
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