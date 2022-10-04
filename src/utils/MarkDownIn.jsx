import React, { useContext } from 'react'
import { Input } from 'antd'
import { MarkdownContext } from '../Context/editor.context'

const { TextArea } = Input;

function MarkDownIn() {
    const { mdContext, setMdContext } = useContext(MarkdownContext)

    return (
        <div>
            <p style={{
                marginTop: '12px',
                marginBottom: '5px',
                paddingLeft: '5px',
                fontSize: '18px',
                fontWeight: '700',
                fontStyle: 'italic',
                color: 'azure',
                backgroundColor: 'goldenrod'
            }}>Markdown Input</p>
            <TextArea
                value={mdContext}
                onChange={(e) => setMdContext(e.target.value)}
                placeholder="You can use markdown here... Remember to enter twice Enter to change lines.."
                autoSize={{
                    minRows: 3,
                    maxRows: 5,
                }}
            />
        </div>
    )
}

export default MarkDownIn