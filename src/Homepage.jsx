import Head from './Head'
import { Carousel, Tabs, Modal, Input, Button } from 'antd';
import './css/Homepage.css'
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "antd/dist/antd.min.css";
import { SearchContext } from './Context/search.context';
import CardItem from './CardItem';
import { readAllAriticles, readAllQuestions } from './utils/firebase';
import Foot from './Foot';

function Homepage() {
    const location = useLocation()
    let authedEmail = ''
    let authedUserName = ''
    // console.log("homepage email: ", )
    try {
        if (location.state.userEmail !== null && location.state.username !== null) {
            authedEmail = location.state.userEmail
            authedUserName = location.state.username
        }
    } catch (error) {
        authedEmail = null
    }
    // console.log("authedUserName", authedUserName)

    // let questionList = []
    const { searchTerm } = useContext(SearchContext)
    const [questionList, setQuestionList] = useState([])
    const [articleList, setArticleList] = useState([])

    useEffect(() => {
        readAllQuestions().then(res => {
            setQuestionList(res)
        })

        readAllAriticles().then(res => {
            setArticleList(res)
        })
    }, [])

    // console.log('articleList', articleList)


    let filteredQuestion = []
    if (searchTerm === null)
        for (var i = 0; i < questionList.length; i++) {
            filteredQuestion.push(questionList[i][1])
        }
    else {
        for (var i = 0; i < questionList.length; i++) {
            // console.log("questionList[i].title.toLowerCase()", searchTerm.toLowerCase())
            if (
                questionList[i][1].title.toLowerCase().includes(searchTerm.toLowerCase())
                || questionList[i][1].content.toLowerCase().includes(searchTerm.toLowerCase())
                || questionList[i][1].tags.toLowerCase().includes(searchTerm.toLowerCase())
                || questionList[i][1].createTime.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                filteredQuestion.push(questionList[i][1])
            }
        }
    }

    let filteredArticle = []
    if (searchTerm === null)
        for (var i = 0; i < articleList.length; i++) {
            filteredArticle.push(articleList[i][1])
        }
    else {
        for (var i = 0; i < articleList.length; i++) {
            // console.log("questionList[i].title.toLowerCase()", searchTerm.toLowerCase())
            if (
                articleList[i][1].title.toLowerCase().includes(searchTerm.toLowerCase())
                || articleList[i][1].content.toLowerCase().includes(searchTerm.toLowerCase())
                || articleList[i][1].tags.toLowerCase().includes(searchTerm.toLowerCase())
                || articleList[i][1].createTime.toLowerCase().includes(searchTerm.toLowerCase())
                || articleList[i][1].abstract.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                filteredArticle.push(articleList[i][1])
            }
        }
    }

    const items = [
        {
            label: 'question',
            key: 'tab1',
            children: (
                <div className='cardlist'>
                    {
                        filteredQuestion.map((question, i) => {
                            return (
                                <CardItem key={`question${i}`}
                                    id={i}
                                    show='question'
                                    class={'card'}
                                    questionID={questionList[i][0]}
                                    className='card'
                                    title={question.title}
                                    content={question.content}
                                    tags={question.tags}
                                    date={question.createTime}
                                    username={question.username} />
                            )
                        })
                    }
                </div>
            )
        },
        {
            label: 'articles',
            key: 'tab2',
            children: (
                <div className='cardlist'>
                    {
                        filteredArticle.map((article, i) => {
                            {/* console.log(`article${i} id is: `, articleList[i][0]) */ }
                            return (
                                <CardItem key={`article${i}`}
                                    id={i}
                                    show='article'
                                    class={'card'}
                                    articleID={articleList[i][0]}
                                    className='card'
                                    title={article.title}
                                    abstract={article.abstract}
                                    content={article.content}
                                    tags={article.tags}
                                    date={article.createTime}
                                    username={article.username} />
                            )
                        })
                    }
                </div>
            )
        }
    ]

    const [subscribeEmail, setSubscribeEmail] = useState('')
    // console.log(subscribeEmail)
    const handleOk = async () => {
        await fetch('http://localhost:4000/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: subscribeEmail
            })
        })
            .then(response => response.json())
            .then(data => JSON.parse(data))
            .catch(err => console.log('error', err.message))

    }

    return (
        <div className="homepage">
            <Head />

            <Carousel autoplay>
                <div className="calousel">
                    <h3>1</h3>
                </div>
                <div className="calousel">
                    <h3 >2</h3>
                </div>
                <div className="calousel">
                    <h3 >3</h3>
                </div>
            </Carousel>

            <p className="welcome">Welcome to Ask and Post, DEV@DEAKIN!</p>

            <Tabs centered items={items} />


            <div style={{
                display: 'flex',
                width: '80%',
                margin: '15px 0 10px 10%'
            }}>
                <label>Sign up for our daily insider!</label>
                <Input 
                style={{
                    width: '80%',
                    margin: '0 10px'
                }}
                onChange={(e) => {
                    e.preventDefault()
                    setSubscribeEmail(e.target.value)
                }} />
                <Button type='primary' onClick={handleOk}>click</Button>
            </div>
            <Foot />
        </div>
    )
}

export default Homepage