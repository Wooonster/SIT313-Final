import React, { useEffect, useState } from 'react'
import { Form, Radio } from 'antd'
import Type from './Type';
import { DoubleLeftOutlined } from '@ant-design/icons'
import "antd/dist/antd.min.css";
import { useNavigate } from 'react-router-dom';
import { auth, getUserNameByUserEmail } from './utils/firebase';

function Post() {
    const [value, setValue] = useState('question')
    const handleClick = (e) => {
        setValue(e.target.value)
    }

    const navigate = useNavigate()
    let userEmail = ''
    const [username, setUsername] = useState('')
    const curUser = auth.currentUser
    if (curUser !== null) {
        userEmail = curUser.email
    }
    useEffect(() => {
        if (userEmail !== '')
            getUserNameByUserEmail(userEmail).then(res => {
                setUsername(res)
            })
    }, [])

    console.log('user info in post', userEmail, username)

    return (
        <div className='post' style={{ width: "80%", marginLeft: "10%" }}>
            <div className="posthead">
                <p>
                    <DoubleLeftOutlined onClick={() => {
                        navigate('/', {
                            state: {
                                email: userEmail
                            }
                        })
                    }} style={{ marginLeft: '5px', color: '#6dabe4' }} />
                    <span style={{ marginLeft: '10px' }}>New Post</span>
                </p>
            </div>

            <Form>
                <Form.Item label="Select Post Type:">
                    <Radio.Group defaultValue='question'>
                        <Radio value="question" defaultChecked onClick={handleClick} autoFocus> Question </Radio>
                        <Radio value="article" onClick={handleClick}> Article </Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>

            <Type typeName={value} email={userEmail} username={username} />
        </div>
    )
}

export default Post