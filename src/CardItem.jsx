import React, { useState } from 'react'
import { Card, Button, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import "antd/dist/antd.min.css";
// import { getUserNameByUserEmail } from './utils/firebase';

function CardItem(props) {
    const handleClick = () => {
        document.getElementById(`card${props.id}`).style.display = 'none'
    }

    const [modalOpen, setModalOpen] = useState(false);
    // const username = getUserNameByUserEmail(props.email)
    // console.log('getUserNameByUserEmail(props.email)', getUserNameByUserEmail(props.email))

    // console.log('card', props.username)

    return (
        <Draggable>
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
                            visible={modalOpen}
                            onOk={() => setModalOpen(false)}
                            onCancel={() => setModalOpen(false)}
                        >
                            <h3>{props.discription}</h3>
                            <p>Post Time: <span style={{ color: "deepskyblue" }}>{props.date}</span></p>
                            <p>From: <span style={{ color: "deepskyblue" }}>{props.username}</span></p>
                        </Modal>
                        <CloseOutlined style={{ marginTop: '8px' }} onClick={handleClick} />
                    </p>
                }
                hoverable
                className="card"
            >
                <p>{props.discription}</p>
                <p>{props.tags}</p>
                <p>{props.date}</p>
            </Card>
        </Draggable>
    )
}

export default CardItem