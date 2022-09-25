import React, { useState } from 'react'
import { Form, Radio } from 'antd'
// import Type from './Type';
import "antd/dist/antd.min.css";
import { useLocation } from 'react-router-dom';

function Post() {
    const [value, setValue] = useState('question')
    const handleClick = (e) => {
        setValue(e.target.value)
    }

    const location = useLocation('fromHome')
    console.log("post location", location.state)

    return (
        <div>
            <div className="head">
                <p>New Post</p>
            </div>

            <Form >
                <Form.Item label="Select Post Type:">
                    <Radio.Group defaultValue='question'>
                        <Radio value="question" defaultChecked onClick={handleClick} autoFocus> Question </Radio>
                        <Radio value="article" onClick={handleClick}> Article </Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>

            {/* <Type typeName={value} /> */}
        </div>
    )
}

export default Post