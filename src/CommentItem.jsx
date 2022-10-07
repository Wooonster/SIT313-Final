import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue} from "firebase/database";
// import { LikeOutlined, LikeFilled, DislikeOutlined } from '@ant-design/icons'
import './css/Detail.css'

const { TextArea } = Input;

function CommentItem(props) {
    const id = props.id
    // get comments from real-time db
    const [comments, setComments] = useState([])
    useEffect(() => {
        const db = getDatabase()
        onValue(ref(db, `post-comments/${id}/`), snapshot => {
            const data = snapshot.val()
            if (data !== null) {
                // comments.push(data)
                // console.log(Object.keys(data), Object.values(data))
                setComments(Object.values(data))
            } else {
                console.log('no data')
            }
        })
    }, [])
    // console.log(comments)

    const [isliked, setIsLiked] = useState(false)
    const likeClick = () => {
        setIsLiked((preValue) => {
            return !preValue
        })
    }

    const [reply, setReply] = useState('')
    const [showReply, setShowReply] = useState(false)
    const isBtnDisabled = reply.length === 0

    return (
        <div className='comment-area'>
            {
                comments.map((comment, i) => (
                    <div key={i} style={{
                        width: '100%'
                    }}>
                        <div className='comment'>
                            <p className='comment-author'>{comment.username}</p>
                            <p className='comment-content'>{comment.comment}</p>
                            <span className='comment-time'>{comment.createTime}</span>
                            {/* <Button type='link' icon={isliked ? <LikeFilled /> : <LikeOutlined />} value={isliked} onClick={this.likeClick} >Like</Button> */}
                            {/* <Button type='link' icon={<DislikeOutlined />} >Dislike</Button> */}
                            {/* <Button type='link' onClick={() => {
                                setShowReply((preValue) => { return !preValue })
                            }} >Reply</Button> */}
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
                            <Button type='primary' className='leave-btn' disabled={isBtnDisabled} >reply</Button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default CommentItem