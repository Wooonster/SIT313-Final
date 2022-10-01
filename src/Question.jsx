import React, { useContext, useState } from "react";
import PostHead from "./PostHead";
import './css/Question.css'
import { TitleContext } from "./Context/title.context";
import { saveQuestion2Fb } from "./utils/firebase";
import { Button, notification } from 'antd';
import "antd/dist/antd.min.css";
import { PictuerContext } from "./Context/uploadpicture.context";
import { useNavigate } from "react-router-dom";

function Question(props) {
    const { currentTitle } = useContext(TitleContext)
    const { newPicture } = useContext(PictuerContext)
    const userEmail = props.email
    const username = props.name

    const [questionInfo, setQuestionInfo] = useState({
        content: '',
        tags: ''
    })
    const { content, tags } = questionInfo

    const handleChange = (event) => {
        const { name, value } = event.target
        setQuestionInfo((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }

    const navigate = useNavigate()
    const saveQuestion = async () => {
        try {

            await saveQuestion2Fb(userEmail, username, currentTitle, content, tags, newPicture)
            openNotificationWithIcon('success')
            navigate('/', {
                state: userEmail
            })
        } catch (error) {
            openNotificationWithIcon('error')
            console.log('post question error', error.message)
        }
        
    }

    const openNotificationWithIcon = (type) => {
        if (type === 'success') {
            notification[type]({
                message: 'POST Status',
                description:
                    'Yohoo! Your post has upload successfully!',
            });
        } else {
            notification[type]({
                message: 'POST Status',
                description:
                    'Opse! Something wrong with your post!',
            });
        }
    };

    return (
        <div className="main-body">
            <PostHead />

            <div className="Qmain">
                <p>Describe your problem</p>
                <textarea id='question' onChange={handleChange} value={questionInfo.content} name="content" style={{ minHeight: 100 }} />

            </div>

            <div className="footer">
                <div className="input-title">
                    <label >Tags</label>
                    <input id='tags' onChange={handleChange} value={questionInfo.tags} name='tags' style={{ width: '100%' }} placeholder='Please add up to 3 tags to describe what your article is about e.g., Java' />
                </div>
                <div className="btn">
                    <Button type="primary" onClick={saveQuestion} >Post</Button>
                </div>
            </div>
        </div>
    )
}

export default Question