import { Row, Col, Input, Button, Skeleton, notification } from 'antd'
import { DoubleLeftOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth, getArticleById, getQuestionById, getUserNameByUserEmail, writeComment2RealTimeDB } from './utils/firebase'
import CommentItem from './CommentItem'
import './css/Detail.css'
import Head from './Head'
import Foot from './Foot'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const { TextArea } = Input;

function Detail() {
  const location = useLocation()
  const id = location.state.id
  const type = location.state.type

  // set info useState hook
  const [info, setInfo] = useState({
    title: '',
    content: '',
    createTime: '',
    tags: '',
    username: '',
    email: '',
    abstract: ''
  })

  // set info
  useEffect(() => {
    if (type === 'article') {
      getArticleById(id).then(res => {
        setInfo({
          title: res.title,
          content: res.content,
          createTime: res.createTime,
          tags: res.tags,
          username: res.username,
          email: res.email,
          abstract: res.abstract
        })
        // console.log('article res', res)
      })
    } else {
      getQuestionById(id).then(res => {
        setInfo({
          title: res.title,
          content: res.content,
          createTime: res.createTime,
          tags: res.tags,
          username: res.username,
          email: res.email
        })
      })
    }
  }, [])

  // set comment 
  const [comment, setComment] = useState('');

  const curUser = auth.currentUser
  let curUserEmail = ''
  let curUserName = ''

  // upload comment to db
  const handleComment = async () => {
    if (curUser !== null) {
      curUserEmail = curUser.email
      curUserName = await getUserNameByUserEmail(curUserEmail)
    }
    try {
      writeComment2RealTimeDB(curUserEmail, curUserName, comment, id)
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
  const navigate = useNavigate()

  return (
    <div>
      <Head />
      <Button type='link' icon={<DoubleLeftOutlined />}
        onClick={() => {

          navigate('/')
        }}
        style={{
          fontSize: 18,
          marginLeft: '15px',
          marginTop: '10px'
        }}>Back</Button>
      <div className='detail'>
        <Row>
          <Col span={16} className='content'>
            <Row className='text'>
              <Skeleton active loading={loadingState}>
                <h1>{info.title}</h1>
                <div className='content'>
                  <ReactMarkdown children={info.content} remarkPlugins={[remarkGfm]} />
                </div>
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
              <CommentItem id={id} />
            </Row>
          </Col>
          <Col span={8} >
            <div className='author-info'>
              <h3>Author: <span>{info.username}</span></h3>
              <p>Post time: <span>{info.createTime}</span></p>
              <p>Tags: <span>{info.tags}</span></p>
              {/* <p>Abstract: <span>{info.abstract}</span></p> */}
              {/* {info.abstract === 'null' ? '' : (<p>Abstract: {info.abstract}</p>)} */}
            </div>
          </Col>
        </Row>
      </div>
      <Foot />
    </div>

  )
}

export default Detail