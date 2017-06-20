import React from 'react';

export default function EndGameMessage(props) {
    return (
        <p className="the-end">
            Tu as répondu à toutes les questions! Félicitations!
            <br/>
            <button className="restart-button" onClick={props.handleRestart}>Recommencer!</button>
        </p>
    );
}