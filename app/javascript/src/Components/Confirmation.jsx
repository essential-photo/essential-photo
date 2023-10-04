import React, { useEffect } from 'react';
import './Confirmation.css';
import ModalLayout from '../Layouts/ModalLayout';
import xIcon from '../images/x-icon.svg';
import {BASE_URL, DELETE_IMAGES_ENDPOINT} from '../settings';

export default function Confirmation(props) {
    const {data, isLoading, updateDataItem, setFetchParameters} = useCallAPI();

// initiate file deletion
props.setFetchParameters({
    url: `${BASE_URL}${DELETE_IMAGES_ENDPOINT}/${props.image.id}`,
    method: 'DELETE',
    bodies: []
  });


  return (
    <>
     <p> Delete Modal </p>

    </>
  );

}
