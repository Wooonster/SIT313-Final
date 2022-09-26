import Head from './Head'
import { Carousel } from 'antd';
import './css/Homepage.css'
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import "antd/dist/antd.min.css";
import { SearchContext } from './Context/search.context';
import CardItem from './CardItem';
import { readAllQuestions } from './utils/firebase'

// 
// let questionList = []
// readAllQuestions().then((result) => {
//     // console.log("this is result", result)
//     // setQuestionList(result)
//     questionList = result
// })
// 
var list = readAllQuestions()
let questionList = []
list.then((result) => {
    questionList = result
})


function Homepage() {
    const location = useLocation()
    let authedEmail = ''
    // console.log("homepage email: ", )
    try {
        if (location.state.userEmail !== null) {
            authedEmail = location.state.userEmail
        }
    } catch (error) {
        authedEmail = null
    }

    const { searchTerm } = useContext(SearchContext)
    const filteredQuestion = []
    console.log("question list and searchTerm", questionList, ", ", searchTerm)
    for (var i = 0; i < questionList.length; i++) {
        // console.log("questionList[i].title.toLowerCase()", questionList[i].title.toLowerCase())
        if (questionList[i].title.toLowerCase().includes(searchTerm.toLowerCase())
            || questionList[i].content.toLowerCase().includes(searchTerm.toLowerCase())
            || questionList[i].tags.toLowerCase().includes(searchTerm.toLowerCase())
            || questionList[i].createTime.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredQuestion.push(questionList[i])
        }
    }

    return (
        <div className="homepage">
            <Head authed={authedEmail} />
            {/* <Head /> */}
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
                                date={question.createTime} />
                        )
                    })
                }
            </div>

        </div>
    )
}

export default Homepage