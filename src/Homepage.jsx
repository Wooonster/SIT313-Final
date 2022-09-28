import Head from './Head'
import { Carousel } from 'antd';
import './css/Homepage.css'
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "antd/dist/antd.min.css";
import { SearchContext } from './Context/search.context';
import CardItem from './CardItem';
import { readAllQuestions } from './utils/firebase';

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
    const getQuestions = async () => {
        return readAllQuestions().then(res => {
            return res
        })
    }

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const q = await getQuestions()
                console.log("q", q)
                setQuestionList(q)
            } catch (error) {
                console.log('load question failed', error.message)
            }
        }

        loadQuestions()
    }, [])


    let filteredQuestion = []
    if (searchTerm === null)
        filteredQuestion = questionList
    else {
        for (var i = 0; i < questionList.length; i++) {
            // console.log("questionList[i].title.toLowerCase()", searchTerm.toLowerCase())
            if (
                questionList[i].title.toLowerCase().includes(searchTerm.toLowerCase())
                || questionList[i].content.toLowerCase().includes(searchTerm.toLowerCase())
                || questionList[i].tags.toLowerCase().includes(searchTerm.toLowerCase())
                || questionList[i].createTime.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                filteredQuestion.push(questionList[i])
            }
        }
    }

    // console.log("filteredQuestion", filteredQuestion)

    return (
        <div className="homepage">
            <Head authed={authedEmail} username={authedUserName} />

            <Carousel autoplay>
                <div className="calousel">
                    <h3 >1</h3>
                </div>
                <div className="calousel">
                    <h3 >2</h3>
                </div>
                <div className="calousel">
                    <h3 >3</h3>
                </div>
                <div className="calousel">
                    <h3 >4</h3>
                </div>
            </Carousel>

            <p className="welcome">Welcome to Job Finder, DEV@DEAKIN!</p>

            <div className='cardlist'>
                {
                    filteredQuestion.map((question, i) => {
                        return (
                            <CardItem
                                id={i}
                                className='card'
                                title={question.title}
                                discription={question.content}
                                tags={question.tags}
                                date={question.createTime}
                                username={question.username} />
                        )
                    })
                }
            </div>

        </div>
    )
}

export default Homepage