import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { getUserComments } from './utils/firebase'
import { LikeOutlined, LikeFilled, DislikeOutlined } from '@ant-design/icons'
import './css/Detail.css'

const { TextArea } = Input;

function CommentItem(props) {
    const [comments, setComments] = useState([])
    useEffect(() => {
        getUserComments().then(res => {
            setComments(res)
        })
    }, [])

    const filteredComment = comments.filter((comment) =>
        comment[1].questionId === props.id
    )

    const [isliked, setIsLiked] = useState(false)
    const likeClick = () => {
        setIsLiked((preValue) => {
            return !preValue
        })
    }

    const [reply, setReply] = useState('')
    const [showReply, setShowReply] = useState(false)
    const isBtnDisabled = reply.length === 0

    const submitReply = () => {

    }

    return (
        <div className='comment-area'>
            {
                filteredComment.map((comment, i) => (
                    <div key={i}>
                        <div className='comment'>
                            <p className='comment-author'>{comment[1].username}</p>
                            <p className='comment-content'>{comment[1].comment}</p>
                            <span className='comment-time'>{comment[1].createTime}</span>
                            {/* <Button type='link' icon={isliked ? <LikeFilled /> : <LikeOutlined />} value={isliked} onClick={this.likeClick} >Like</Button> */}
                            {/* <Button type='link' icon={<DislikeOutlined />} >Dislike</Button> */}
                            <Button type='link' onClick={() => {
                                setShowReply((preValue) => { return !preValue })
                            }} >Reply</Button>
                        </div>
                        <div className={showReply ? 'reply' : 'reply-hide'} >
                            <TextArea
                                value={reply}
                                id='reply-box'
                                className='reply-box'
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="What's your idea..."
                                autoSize={{
                                    minRows: 3,
                                    maxRows: 5,
                                }}
                            />
                            <Button type='primary' className='leave-btn' onClick={submitReply} disabled={isBtnDisabled} >reply</Button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default CommentItem