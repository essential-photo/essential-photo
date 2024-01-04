import React from 'react';
import './Confirmation.css';
import ModalLayout from '../Layouts/ModalLayout';
import xIcon from '../images/x-icon.svg';

export default function Confirmation(props) {
  function handleYesClick(event) {
    props.handleConfirm();
  }

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
