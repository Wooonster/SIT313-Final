import React, { useContext } from 'react'
import { MarkdownContext } from '../Context/editor.context'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function MarkDownRes() {
    const { mdContext } = useContext(MarkdownContext)

    return (
        <div className='md-res'>
            <p style={{
                marginTop: '12px',
                marginBottom: '5px',
                paddingLeft: '5px',
                fontSize: '18px',
                fontWeight: '700',
                fontStyle: 'italic',
                color: 'azure',
                backgroundColor: 'goldenrod'
            }}>Markdown result</p>
            <div className='res' style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: '6',
                overflow: 'scroll'
            }}>
                <ReactMarkdown children={mdContext} remarkPlugins={[remarkGfm]} />
            </div>
        </div>
    )
}

export default MarkDownRes