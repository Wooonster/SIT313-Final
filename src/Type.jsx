import React from "react";
import Article from "./Article";
import Question from "./Question";

function Type (props) {
    if(props.typeName === 'question') {
        return (
            <Question email={props.email} name={props.username} />
        )
    } else {
        return (
            <Article email={props.email} name={props.username} />
        )
    }
}

export default Type