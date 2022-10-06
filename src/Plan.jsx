import React from 'react'
import Head from './Head'
import './css/Plan.css'
import PriceCard from './PriceCard'
import { DoubleLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import Foot from './Foot'

function Plan() {
  // const curUser = auth.currentUser
  const basicRight = ['fundamental functions', 'post questions', 'post articles', 'make comments']
  const silverRights = ['reply to comments', 'using markdown']
  const goldenRights = ['chattin with other uses privately', 'using a better experiencing markdown']

  const navigate = useNavigate()

  return (
    <div className='plan'>
      <Head />
      <Button type='link' icon={<DoubleLeftOutlined />}
        onClick={() => {

          navigate('/')
        }}
        style={{
          fontSize: 18,
          marginLeft: '15px',
          marginTop: '10px'
        }}>Back</Button>
      <p className='title'>Price Plans for Pro</p>

      <div className='price-table'>
        <PriceCard title='Free' borderColor='lightskyblue' price='0' rights={basicRight} />
        <PriceCard title='Sliver' borderColor='silver' price='$99' link='https://buy.stripe.com/test_fZecQ5aRt6yYbRefYZ' rights={silverRights} />
        <PriceCard title='Golden' borderColor='goldenrod' price='$199' link='https://buy.stripe.com/test_eVadU9gbNe1q5sQbIK' rights={goldenRights} />

      </div>

      <Foot />
    </div>
  )
}

export default Plan