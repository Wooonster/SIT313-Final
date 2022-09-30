import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { getUserComments } from './utils/firebase'
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons'

function CommentItem(props) {
    const [comments, setComments] = useState([])
    useEffect(() => {
        getUserComments().then(res => {
            setComments(res)
        })
    }, [])

    const filteredComment = comments.filter((comment) =>
        comment[1].questionId === props.questionId
    )

    return (
        <div>
            {
                filteredComment.map((comment) => (
                    <div key={comment[0]} className='comment'>
                        <p className='comment-author'>{comment[1].username}</p>
                        <p className='comment-content'>{comment[1].comment}</p>
                        <span className='comment-time'>{comment[1].createTime}</span>
                        <Button type='link' icon={<LikeOutlined />} >Like</Button>
                        <Button type='link' icon={<DislikeOutlined />} >Dislike</Button>
                        <Button type='link'>Reply</Button>
                    </div>
                ))
            }
        </div>
    )
}

export default CommentItem