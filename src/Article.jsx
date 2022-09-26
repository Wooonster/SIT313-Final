import React, { useContext, useState } from "react";
import './css/Article.css'
import PostHead from "./PostHead";
import { TitleContext } from "./Context/title.context";
import { saveArticle2Fb } from "./utils/firebase";
import { Button, notification } from 'antd';
import "antd/dist/antd.min.css";
import { PictuerContext } from "./Context/uploadpicture.context";

function Article(props) {
    const { currentTitle } = useContext(TitleContext)
    console.log("currentTitle is: ", currentTitle)
    const { newPicture } = useContext(PictuerContext)
    console.log("newPicture", newPicture)
    const userEmail = props.email

    const [articleInfo, setArticleInfo] = useState({
        abstract: '',
        content: '',
        tags: ''
    })
    const { abstract, content, tags } = articleInfo
    console.log("aticleInfo is: ", articleInfo)

    const handleChange = (event) => {
        const { name, value } = event.target
        setArticleInfo((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }

    const saveArticle = async () => {
        try {
            await saveArticle2Fb(userEmail, currentTitle, abstract, content, tags, newPicture)
        } catch (error) {
            openNotificationWithIcon('error')
        }
        openNotificationWithIcon('success')
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
                <textarea id='article-abs' onChange={handleChange} value={articleInfo.abstract} name='abstract' placeholder='Enter a 1-paragraph abstract' style={{ maxHeight: 100 }} />
                <p>Article Text</p>
                <textarea id='article-text' onChange={handleChange} value={articleInfo.content} name='content' placeholder='Enter a 1-paragraph abstract' style={{ minHeight: 100 }} />
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