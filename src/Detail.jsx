import { Row, Col, Input, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getQuestionById } from './utils/firebase'
import './css/Detail.css'

const { TextArea } = Input;

function Detail() {
  const location = useLocation()
  const id = location.state.questionId
  // console.log('question id', id)

  // get this question
  const getQuestion = async () => {
    return getQuestionById(id).then(res => {
      return res
    })
  }
  const [questionInfo, setQuestionInfo] = useState({
    title: '',
    content: '',
    createTime: '',
    tags: '',
    username: '',
    email: ''
  })
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const q = await getQuestion()
        setQuestionInfo({
          title: q.title,
          content: q.content,
          createTime: q.createTime,
          tags: q.tags,
          username: q.username,
          email: q.email
        })
      } catch (error) {
        console.log('loadQuestion error', error.message)
      }
    }
    loadQuestion()
  }, [])

  const [comment, setComment] = useState('');


  return (
    <div>
      <div className='detail'>
        <Row>
          <Col span={16} className='content'>
            <Row className='text'>
              <h1>{questionInfo.title}</h1>
              <p>{questionInfo.content}</p>
            </Row>
            <Row className='comment'>
              <TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave your kind comment here..."
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
              />
              <Button type='primary' className='leave-btn'>comment</Button>
            </Row>
          </Col>
          <Col span={8} className='author-info'>
            <div>
              <h3>Author: <span>{questionInfo.username}</span></h3>
              <p>Post time: <span>{questionInfo.createTime}</span></p>
              <p>Tags: <span>{questionInfo.tags}</span></p>
            </div>
          </Col>
        </Row>
      </div>
    </div>

  )
}

export default Detail