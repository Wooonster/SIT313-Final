import React, { useState } from 'react'
// import { Row, Col, Input } from 'antd'
import './css/Auth.css'
import "antd/dist/antd.min.css";
import { Button } from 'antd';
import { updateUserPassword } from './utils/firebase';
import { useNavigate } from "react-router-dom";

function Forget() {
    const [change, setChange] = useState({
        email: '',
        newPwd: ''
    })
    const { email, newPwd } = change
    const handleChange =  (event) => {
        const { name, value } = event.target
        setChange((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }

    const navigate = useNavigate()
    const handleClick = async (e) => {
        e.preventDefault()

        try {
            if (!email && !newPwd) {
                document.getElementById('error').innerHTML = 'Please enter your email and password!'
            } else if (!email) {
                document.getElementById('error').innerHTML = 'Please enter your email!'
            } else if (!newPwd) {
                document.getElementById('error').innerHTML = 'Please enter your password!'
            } else {
                await updateUserPassword(email, newPwd)
                navigate('/login')
            }
        } catch (error) {
            console.log('login with eamil error: ', error.message)
            document.getElementById('error').innerHTML = 'Sorry. Change password failed!'
        }
    }

    return (
        <div className='forget-container'>
            <div className="forget-form">
                <h2>Lost your account?</h2>
                <form className='form'>
                    <div className="form-group">
                        <label>What's your email...</label>
                        {/* <input onChange={handleChange} value={contact.email} type='text' name='email' placeholder='Email' /> */}
                        <input onChange={handleChange} value={change.email} name='email' />
                    </div>
                    <div className="form-group">
                        <label>What's your new password...</label>
                        {/* <input onChange={handleChange} value={contact.password} type='password' name='password' placeholder='Password' /> */}
                        <input onChange={handleChange} value={change.newPwd} name='newPwd' />
                    </div>
                    <div className="form-group right" >
                        <p id='error' className="error" />
                        <Button type='primaty' onClick={handleClick} >submit</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Forget