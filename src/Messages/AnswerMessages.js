import React from 'react';

export function SuccessMessage() {
    return <ShowMessage className="answer-result success" message="Bravo !" />;
}

export function ErrorMessage() {
    return <ShowMessage className="answer-result error" message="Oh non, ce n'est pas la bonne réponse!" />;
}

export function ShowErrorMessage(props) {
    return <ShowMessage className="answer-result error" message={props.message} />;
}

export function ShowMessage(props) {
    if (props.message === null) {
        return null;
    }
    
    return <p className={props.className}>{props.message}</p>;
}