import React, { useContext, useState } from "react";
import './css/Article.css'
import PostHead from "./PostHead";
import { TitleContext } from "./Context/title.context";
import { saveArticle2Fb } from "./utils/firebase";
import { Button, notification, Input } from 'antd';
import "antd/dist/antd.min.css";
import { PictuerContext } from "./Context/uploadpicture.context";
import { useNavigate } from "react-router-dom";
import MarkDownIn from "./utils/MarkDownIn";
import MarkDownRes from "./utils/MarkDownRes";
import { MarkdownContext } from "./Context/editor.context";

const { TextArea } = Input;

function Article(props) {
    const { currentTitle } = useContext(TitleContext)
    const { newPicture } = useContext(PictuerContext)
    const { mdContext } = useContext(MarkdownContext)

    const userEmail = props.email
    const username = props.name

    const [articleInfo, setArticleInfo] = useState({
        abstract: '',
        tags: ''
    })
    const { abstract, tags } = articleInfo
    // console.log("aticleInfo is: ", articleInfo)

    const handleChange = (event) => {
        const { name, value } = event.target
        setArticleInfo((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }

    const navigate = useNavigate()
    const saveArticle = async () => {
        try {
            await saveArticle2Fb(userEmail, username, currentTitle, abstract, mdContext, tags, newPicture)
            openNotificationWithIcon('success')
            navigate('/', {
                state: userEmail
            })
        } catch (error) {
            openNotificationWithIcon('error')
            console.log('post article error', error.message)
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

            <div className="Amain">
                <p>Abstract</p>
                <TextArea
                    id='article-abs'
                    onChange={handleChange}
                    value={articleInfo.abstract}
                    name='abstract'
                    placeholder='Enter a 1-paragraph abstract'
                    autoSize={{
                        minRows: 2,
                        maxRows: 4,
                    }} />
                {/* <textarea id='article-abs' onChange={handleChange} value={articleInfo.abstract} name='abstract' placeholder='Enter a 1-paragraph abstract' style={{ maxHeight: 100 }} /> */}
                <p>Article Text</p>
                <MarkDownIn />
                <MarkDownRes />
                {/* <textarea id='article-text' onChange={handleChange} value={articleInfo.content} name='content' placeholder='Enter a 1-paragraph abstract' style={{ minHeight: 100 }} /> */}
            </div>

            <div className="footer">
                <div className="input-title">
                    <label >Tags</label>
                    <input id='tags' onChange={handleChange} value={articleInfo.tags} name='tags' style={{ width: '100%' }} placeholder='Please add up to 3 tags to describe what your article is about e.g., Java' />
                </div>
                <div className="btn">
                    <Button type="primary" onClick={saveArticle} >Post</Button>
                </div>
            </div>
        </div>
    )
}

export default Article