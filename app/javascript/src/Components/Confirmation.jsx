import React from 'react';
import './Confirmation.css';
import ModalLayout from '../Layouts/ModalLayout';
import xIcon from '../images/x-icon.svg';

export default function Confirmation(props) {
  let errors = [];

  function handleYesClick(event) {
    props.setFetchParameters({
      url: props.url,
      method: props.method,
      bodies: props.bodies
    })
  }

  // if fetch goes through with a 200 code,
  // then close the confirmation, else
  // display the error message
  if (props.fetchResults.length > 0) {
    if (props.fetchResults[0].responseStatus === 200) {
      props.close();
    }
    else {
      errors = props.fetchResults[0].responseBody.map(errorMessage =>
        <p className="formSubmitErrorMessage">{errorMessage}</p>
      );
    }
  }
  
  // clear any fetch results when the component
  // first renders
  React.useEffect(() => {
    if (props.fetchResults.length > 0) {
      props.clearFetchResults();
    }
  }, [props.fetchResults])

  console.log('Confirmation rendered');

  return (
    <ModalLayout close={props.close}>
      <div className="confirmation">
        <img
          src={xIcon}
          className="confirmation__closeIcon"
          onClick={() => {props.close()}}
          alt="this is an X icon"
        ></img>
        <p className="confirmation__message">Are you sure?</p>
        <div className="confirmation__buttonContainer">
          <button 
            className='button button--active confirmation__button'
            onClick={handleYesClick}
          >
            Yes
          </button>
          <button
            className='button confirmation__button'
            onClick={() => {props.close()}}
          >
            No
          </button>
        </div>
      </div>
    </ModalLayout>
  )
}
