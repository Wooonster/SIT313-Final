import React, { useState } from 'react'
// import { Row, Col, Input } from 'antd'
import './css/Auth.css'
import "antd/dist/antd.min.css";
import { Button } from 'antd';
import { updateUserPassword } from './utils/firebase';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'

function Forget() {
    const [change, setChange] = useState({
        email: ''
    })
    const { email } = change
    const handleChange = (event) => {
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
            if (!email) {
                document.getElementById('error').innerHTML = 'Please enter your email!'
            } else {
                await updateUserPassword(email)
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
                    <div className="form-group right" >
                        <p id='error' />
                    </div>
                    <div className="form-group">
                        <label><Link to='/login'>I found my password!!!</Link></label>
                    </div>
                </form>
                <Button type='primary' onClick={handleClick} style={{width: '100px', height: '40px', fontSize: '20px', float: 'right', marginRight: '150px'}}>Submit</Button>
            </div>
        </div>
    )
}

export default Forget