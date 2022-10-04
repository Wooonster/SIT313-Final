import React from 'react'
import { Button, Card } from 'antd'

function PriceCard(props) {
    const rights = props.rights

    return (
        <Card
            title={props.title}
            className='price'
            hoverable
            style={{
                width: 500,
                height: 600,
                margin: '100px auto',
                fontSize: '18px',
                textAlign: 'center',
                border: `2px solid ${props.borderColor}`
            }}
        >
            <p style={{
                fontSize: '21px'
            }}>{props.price}/monthly</p>
            {rights.map((right, i) => 
                <p key={i}
                style={{
                    fontSize: '18px',
                    fontStyle: 'italic'
                }}
                >{right}</p>
            )}
            {props.title === 'Free'
                ? <Button type='dash' disabled>Currently</Button>
                : <Button type='primary' onClick={() => { window.open(props.link) }}>Try this</Button>}
        </Card>
    )
}

export default PriceCard