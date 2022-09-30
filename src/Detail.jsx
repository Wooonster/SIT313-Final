import { Row, Col, Input, Button, Skeleton, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { addUserComment, auth, getQuestionById, getUserNameByUserEmail } from './utils/firebase'
import CommentItem from './CommentItem'
import './css/Detail.css'
const { TextArea } = Input;

function Detail() {
  const location = useLocation()
  const questionId = location.state.questionId
  // console.log('question id', id)

  // get this question
  const getQuestion = async () => {
    return getQuestionById(questionId).then(res => {
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

  // set comment 
  const [comment, setComment] = useState('');

  // upload comment to db
  const handleComment = async () => {
    const curUser = auth.currentUser
    console.log('current user: ', curUser)
    let curUserEmail = ''
    let curUserName = ''
    if (curUser !== null) {
      curUserEmail = curUser.email
      curUserName = await getUserNameByUserEmail(curUserEmail)
    }
    try {
      await addUserComment(curUserEmail, curUserName, comment, questionId)
      openNotificationWithIcon('success')
      setComment('')
    } catch (error) {
      console.log('failed to comment')
      openNotificationWithIcon('error')
    }
  }

  // make notification
  const openNotificationWithIcon = (type) => {
    if (type === 'success') {
      notification[type]({
        message: 'Comment successfully!'
      });
    } else {
      notification[type]({
        message: 'Comment failed!'
      });
    }
  };

  // 骨架屏
  const [loadingState, setLoadingState] = useState(true)
  setTimeout(() => {
    setLoadingState(false)
  }, 1500)

  // no authed no comment 
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const curUser = auth.currentUser
    if (curUser === null) setHidden(true)
  }, [])

  const isBtnDisabled = comment.length === 0

  return (
    <div>
      <div className='detail'>
        <Row>
          <Col span={16} className='content'>
            <Row className='text'>
              <Skeleton active loading={loadingState}>
                <h1>{questionInfo.title}</h1>
                <p>{questionInfo.content}</p>
              </Skeleton>
            </Row>
            <Row className={hidden ? 'comment-hide' : 'comments'}>
              <TextArea
                value={comment}
                id='comment-box'
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave your kind comment here..."
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
              />
              <Button type='primary' className='leave-btn' onClick={handleComment} disabled={isBtnDisabled} >comment</Button>
            </Row>
            <Row>
              <CommentItem questionId={questionId} />
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