import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAuthUserWithEmailAndPassword, createUserDocFromAuth } from './utils/firebase'
import './css/Auth.css'
import deakinLogo from './images/deakin-logo.jpg'
import "antd/dist/antd.min.css";

function Signup() {
    const [contact, setContact] = useState({
        displayName: '',
        email: '',
        password: '',
        rePassword: ''
    })
    const { displayName, email, password, rePassword } = contact
    console.log(contact)

    const handleChange = (event) => {
        const { name, value } = event.target
        setContact((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }

    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (password !== rePassword) {
            alert("Password not match!")
            return
        }

        if (!email && !password && !displayName && !rePassword) {
            document.getElementById('error').innerHTML = 'Please enter your information!'
        } else if (!password) {
            document.getElementById('error').innerHTML = 'Please enter your password!'
        } else if (!displayName) {
            document.getElementById('error').innerHTML = 'Please enter your name!'
        } else if (!rePassword) {
            document.getElementById('error').innerHTML = 'Please confirem your password!'
        } else if (!email) {
            document.getElementById('error').innerHTML = 'Please enter your email!'
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password)
            console.log('user: ', user)
            // 可以加密
            await createUserDocFromAuth(user, { displayName, password })
            // window.location = 'http://localhost:3000/login'
            navigate('/login')
        } catch (error) {
            console.log("create user error:", error.message)
            document.getElementById('error').innerHTML = 'Sign up error! Check your information!'
        }

    }

    return (
        <div className="auth">
            <div className="container">
                <div className="logoPart">
                    <img className="picture" src={deakinLogo}></img>
                    <p>Welcome Joining<br /><br /><span>DEV@DEAKIN</span></p>
                    <Link to='/login' >Click to Login</Link>
                </div>
                <div className="auth-form">
                    <h2>Sign up to Join Us</h2>
                    <form className='form'>
                        <div className="form-group">
                            <label>Your email<span>*</span></label>
                            <input onChange={handleChange} value={contact.email} type='text' name='email' placeholder='Email' />
                        </div>
                        <div className="form-group">
                            <label>Your name<span>*</span></label>
                            <input onChange={handleChange} value={contact.displayName} type='text' name='displayName' placeholder='Name' />
                        </div>
                        <div className="form-group">
                            <label>Your password<span>*</span></label>
                            <input onChange={handleChange} value={contact.password} type='password' name='password' placeholder='Password' />
                        </div>
                        <div className="form-group">
                            <label>Confirm password<span>*</span></label>
                            <input onChange={handleChange} value={contact.rePassword} type='password' name='rePassword' placeholder='Confirm Password' />
                        </div>
                        <div className="form-group right" >
                            <p className="error" id="error"></p>
                            <input onClick={handleSubmit} type='submit' name='login' id='login' value='Signup' className="button" />
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Signup