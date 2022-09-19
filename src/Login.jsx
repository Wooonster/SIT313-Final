import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './css/Auth.css'
import { signInAuthUserWithEmailAndPassword } from "./utils/firebase";
import deakinLogo from './images/deakin-logo.jpg'
import "antd/dist/antd.min.css";

function Login() {
    // const loginGoogleUser = async () => {
    //     const { user } = await signInWithGooglePopup()
    //     // console.log('sign in with google: ', res)
    //     await createUserDocFromAuth(user)
    // }

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
                const responce = await signInAuthUserWithEmailAndPassword(email, password)
                console.log('username & password ', email, password)
                console.log('login responce: ', responce, email, password)
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

    return (
        <div className="container">
            <div className="logoPart">
                <img className="picture" src={deakinLogo} alt='deakin-logo' />
                <p>Welcome Joining<br /><br /><span>DEV@DEAKIN</span></p>
                <Link to='/signup'>Click to Sign Up</Link>
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
            </div>
        </div>
    )
}

export default Login