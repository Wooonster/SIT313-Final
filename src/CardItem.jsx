import React, { useState } from 'react'
import { Card, Button, Modal, Popover } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import "antd/dist/antd.min.css";
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
// import { getUserNameByUserEmail } from './utils/firebase';

function CardItem(props) {
    const handleClick = () => {
        document.getElementById(`card${props.id}`).style.display = 'none'
    }

    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate()

    // console.log('ids', props.questionID, ' ', props.articleID)
    const click2Detail = () => {
        if (props.show === 'question') {
            navigate('/detail', {
                state: {
                    type: props.show,
                    id: props.questionID
                }
            })
        } else {
            navigate('/detail', {
                state: {
                    type: props.show,
                    id: props.articleID
                }
            })
        }

    }

    const content = (
        <div>
            <p>Double Click to see more!</p>
        </div>
    )

    return (
        <Draggable>
            <Popover content={content} trigger='hover' placement='right'>
                <Card
                    id={`card${props.id}`}
                    title={props.title}
                    extra={
                        <p style={{ display: 'flex' }}>
                            <Button type="text" style={{ color: 'dodgerblue' }} onClick={() => setModalOpen(true)}>
                                More
                            </Button>
                            <Modal
                                title={props.title}
                                centered
                                open={modalOpen}
                                onOk={() => setModalOpen(false)}
                                onCancel={() => setModalOpen(false)}
                            >
                                <h3>{props.content}</h3>
                                <p>Post Time: <span style={{ color: "deepskyblue" }}>{props.date}</span></p>
                                <p>From: <span style={{ color: "deepskyblue" }}>{props.username}</span></p>
                            </Modal>
                            <CloseOutlined style={{ marginTop: '8px' }} onClick={handleClick} />
                        </p>
                    }
                    hoverable
                    className={props.class}
                    onDoubleClick={click2Detail}
                >
                    <div style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '2',
                        overflow: 'hidden'
                    }}>
                        <ReactMarkdown children={props.show === 'question' ? props.content : props.abstract} />
                    </div>
                    <p>{props.tags}</p>
                    <p>{props.date}</p>
                </Card>
            </Popover>
        </Draggable>
    )
}

export default CardItem