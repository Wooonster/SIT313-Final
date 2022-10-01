import React, { useState, useEffect } from 'react'
import { readAllQuestions } from './utils/firebase';
import CardItem from './CardItem';

function MyCardList(props) {
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
                // console.log('q', q)
                setQuestionList(q)
            } catch (error) {
                console.log('load question failed', error.message)
            }
        }

        loadQuestions()
    }, [])


    const filteredQuestion = questionList.filter((question) => question[1].email === props.email)

    return (
        <div className='mycard-list'>
            {
                filteredQuestion.map((question, i) => {
                    {/* console.log(`question ${i}: `, question) */}
                    return (
                        <CardItem key={i}
                            id={i}
                            class={'mycard'}
                            questionID={questionList[i][0]}
                            title={question[1].title}
                            discription={question[1].content}
                            tags={question[1].tags}
                            date={question[1].createTime}
                            username={question[1].username} />
                    )
                })
            }
        </div>
    )
}

export default MyCardList