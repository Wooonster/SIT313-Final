import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './css/Auth.css'
import { saveGoogleUser, signInAuthUserWithEmailAndPassword, signInWithGoogle } from "./utils/firebase";
import deakinLogo from './images/deakin-logo.jpg'
import "antd/dist/antd.min.css";
import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons"

function Login() {

    const [contact, setContact] = useState({
        email: '',
        password: ''
    })
    const { email, password } = contact
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

        try {
            if (!email && !password) {
                document.getElementById('error').innerHTML = 'Please enter your email and password!'
            } else if (!email) {
                document.getElementById('error').innerHTML = 'Please enter your email!'
            } else if (!password) {
                document.getElementById('error').innerHTML = 'Please enter your password!'
            } else {
                await signInAuthUserWithEmailAndPassword(email, password)
                // const responce = await signInAuthUserWithEmailAndPassword(email, password)
                // console.log('username & password ', email, password)
                // console.log('login responce: ', responce, email, password)
                // window.location = 'http://localhost:3000/settings'
                navigate('/settings', {
                    state: {
                        userEmail: email
                    }
                })
            }
        } catch (error) {
            console.log('login with eamil error: ', error.message)
            document.getElementById('error').innerHTML = 'Login Failed! Check your email and password!'
        }
    }

    const googleLogin = () => {
        const res = signInWithGoogle()
        console.log('sign in with google: ', res)

        res.then(data => {
            try {
                saveGoogleUser(data.user.email, data.user.displayName, data.user.metadata.creationTime)
                console.log('google email', data.user.email)
                navigate('/settings', {
                    state: {
                        userEmail: data.user.email
                    }
                })
            } catch (error) {
                console.log('error', error.message)
            }
        })

    }

    return (
        <div className="container">
            <div className="logoPart">
                <img className="picture" src={deakinLogo} alt='deakin-logo' />
                <p>Welcome Joining<br /><br /><span>DEV@DEAKIN</span></p>
                <Link to='/signup'>Click to Sign Up</Link> <br />
                <Link to='/forget'>Forget your password?</Link>
            </div>
            <div className="auth-form">
                <h2>Login Here</h2>
                <form className='form'>
                    <div className="form-group">
                        <label>Your email</label>
                        <input onChange={handleChange} value={contact.email} type='text' name='email' placeholder='Email' />
                    </div>
                    <div className="form-group">
                        <label>Your password</label>
                        <input onChange={handleChange} value={contact.password} type='password' name='password' placeholder='Password' />
                    </div>
                    <div className="form-group right" >
                        <p className="error" id="error"></p>
                        <input type='submit' onClick={handleSubmit} name='login' id='login' value='Login' className="button" />
                    </div>
                </form>
                <div className="login-method">
                    <Button icon={<GoogleOutlined />} onClick={googleLogin}>Login with Google</Button>
                </div>
            </div>
        </div>
    )
}

export default Login