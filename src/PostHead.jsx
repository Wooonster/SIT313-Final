import React, { useContext, useState } from "react";
import './css/PostHead.css'
import { TitleContext } from "./Context/title.context";
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import "antd/dist/antd.min.css";
import { PictuerContext } from "./Context/uploadpicture.context";

function Head(props) {
    const { setCurrentTitle } = useContext(TitleContext)
    const [title, setTitle] = useState('')

    const { setNewPicture } = useContext(PictuerContext)
    const fileStoreList = []


    return (
        <div className="sub-head">
            <div className="posthead">
                <p>What do you want to ask or share</p>
            </div>

            <div className="instr">
                <p style={{ fontSize: '18px' }}>This section is designed based on the type of the post. It could be developed byconditional rendering.
                    <span style={{ color: 'red' }}>For post an article,the following section would be appeared.</span>
                </p>
            </div>

            <div className="input-title">
                <label >Title</label>
                <input id='title'
                    onChange={(e) => {
                        setTitle(e.target.value)
                        setCurrentTitle(title)
                    }}
                    value={title} placeholder={props.placeholder} />
            </div>
            <div className="add-pic" id="add-pic">
                <label>Add a picture for your post</label>

                <Button type="primary" onClick={() => {
                    document.getElementById('broswer').click()
                    document.getElementById('broswer').style.backgroundColor = 'red'
                }} icon={<UploadOutlined />}>Upload</Button>
                <input
                    type="file"
                    multiple
                    id="broswer"
                    className=".hide_file"
                    // placeholder="Choose Files"
                    onChange={(event) => {
                        // setImageUpload(event.target.files[0]);
                        console.log('event.target.files: ', event.target.files)
                        for(var i=0;i<event.target.files.length;i++) {
                            fileStoreList.push(event.target.files[i])
                            setNewPicture(fileStoreList)
                        }
                    }}
                    hidden
                />
            </div>

        </div>
    )
}

export default Head