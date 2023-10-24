import React from 'react';
import './Confirmation.css';
import ModalLayout from '../Layouts/ModalLayout';
import xIcon from '../images/x-icon.svg';
import {BASE_URL, DELETE_ALBUMS_ENDPOINT} from '../settings';
import useCallAPI from '../CustomHooks/useCallAPI';
import { checkPropTypes } from 'prop-types';

export default function Confirmation(props) {
  let errors = [];

  const {
    setFetchParameters: setAlbumFetchParameters,
    fetchResults: albumFetchResults,
    clearFetchResults: clearAlbumFetchResults
  } = useCallAPI();

  function handleYesClick(event) {
    setAlbumFetchParameters({
      url: `${BASE_URL}${DELETE_ALBUMS_ENDPOINT}/${props.id}`,
      method: 'DELETE',
      bodies: []
    })
  }

  // handle fetch response
  if (albumFetchResults.length > 0) {
    if (albumFetchResults[0].responseStatus === 200) {
      props.deleteAlbumData(props.id);
      props.close();
    }
    else {
      errors = fetchResults[0].responseBody.map(errorMessage =>
        <p className="formSubmitErrorMessage">{errorMessage}</p>
      );
    }
  }
  
  // clear any fetch results when the component
  // first renders
  React.useEffect(() => {
    if (albumFetchResults.length > 0) {
      clearAlbumFetchResults();
    }
  }, [])

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
