import React from 'react'
import { Layout, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { LinkedinOutlined, GithubOutlined, FacebookOutlined } from '@ant-design/icons'
import './css/Foot.css'

const { Footer } = Layout

function Foot() {
  return (
    <Layout>
      <Footer className='foot'>
        <Row className='foot-head'>
          <Col className='links'>
            <p>Explore</p>
            <Link to='/post'>Post your idea/problem</Link> <br />
            <Link to='/plan'>Be a PRO</Link> <br />
            <Link to='/settings'>To my place</Link>
          </Col>
          <Col className='links'>
            <p>Stay Connect</p>
            <LinkedinOutlined onClick={() => {window.open('https://www.linkedin.com/in/fangzhou-wang/')}} style={{
              fontSize: 45,
              color: 'azure'
            }} />
            <GithubOutlined onClick={() => {window.open('https://github.com/Wooonster')}} style={{
              fontSize: 45,
              color: 'azure'
            }} />
            <FacebookOutlined onClick={() => {window.open('https://www.facebook.com/profile.php?id=100081121214703')}} style={{
              fontSize: 45,
              color: 'azure'
            }} />
          </Col>
        </Row>
        <Row className='name'>
          <p>DEV@DEAKIN 2022</p>
        </Row>
        <Row className='discription'>
          <p>This website is the final assignment for Deakin University course SIT313</p>
        </Row>
      </Footer>
    </Layout>
  )
}

export default Foot