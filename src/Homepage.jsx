import Head from './Head'
import { Carousel } from 'antd';
import './css/Homepage.css'
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import "antd/dist/antd.min.css";

function Homepage() {
    const location = useLocation()
    let authedEmail = ''
    // console.log("homepage email: ", )
    try {
        if(location.state.userEmail !== null) {
            authedEmail = location.state.userEmail
        }
    } catch (error) {
        authedEmail = null
    }

    return (
        <div className="homepage">
            <Head authed={authedEmail} />
            {/* <Head /> */}
            <Carousel autoplay>
                <div className="calousel">
                    <h3 >1</h3>
                </div>
                <div className="calousel">
                    <h3 >2</h3>
                </div>
                <div className="calousel">
                    <h3 >3</h3>
                </div>
                <div className="calousel">
                    <h3 >4</h3>
                </div>
            </Carousel>
            
            <p className="welcome">Welcome to Job Finder, DEV@DEAKIN!</p>

        </div>
    )
}

export default Homepage