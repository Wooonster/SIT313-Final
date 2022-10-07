import React, { useState, useEffect } from 'react'
import { readAllAriticles, readAllQuestions } from './utils/firebase';
import CardItem from './CardItem';

function MyCardList(props) {
    const [questionList, setQuestionList] = useState([])
    const [articleList, setArticleList] = useState([])


    useEffect(() => {
        readAllQuestions().then(res =>{
            setQuestionList(res)
        })

        readAllAriticles().then(res => {
            setArticleList(res)
        })
    }, [])
    const filteredQuestion = questionList.filter((question) => question[1].email === props.email)
    const filteredArticle = articleList.filter((article)=>article[1].email === props.email)

    // console.log('filtered', filteredArticle, ', ', filteredQuestion)

    return (
        <div className='mycard-list'>
            {
                filteredQuestion.map((question, i) => {
                    {/* console.log(`question ${i}: `, question) */}
                    return (
                        <CardItem key={`question${i}`}
                            id={i}
                            class={'mycard'}
                            show='question'
                            questionID={questionList[i][0]}
                            title={question[1].title}
                            discription={question[1].content}
                            tags={question[1].tags}
                            date={question[1].createTime}
                            username={question[1].username} />
                    )
                })
            }
            {
                filteredArticle.map((article, i) => {
                    return (
                        <CardItem key={`article${i}`}
                            id={i}
                            class={'mycard'}
                            show='article'
                            articleID={articleList[i][0]}
                            title={article[1].title}
                            abstract={article.abstract}
                            discription={article[1].content}
                            tags={article[1].tags}
                            date={article[1].createTime}
                            username={article[1].username} />
                    )
                })
            }
        </div>
    )
}

export default MyCardList