import React from 'react';

function EndGameMessage(props) {
    return (
        <p className="the-end">
            Tu as répondu à toutes les questions! Félicitations!
            <br/>
            <button className="restart-button" onClick={props.handleRestart}>Recommencer!</button>
        </p>
    );
}

export default EndGameMessage;