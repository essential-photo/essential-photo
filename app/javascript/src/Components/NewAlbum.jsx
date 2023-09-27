import React from 'react';
import './NewAlbum.css';
import ModalLayout from '../Layouts/ModalLayout';
import xIcon from '../images/x-icon.svg';
import {BASE_URL, POST_ALBUMS_ENDPOINT} from '../settings';

export default function NewAlbum(props) {
  const [albumName, setAlbumName] = React.useState('');

  function handleChange(event) {
    setAlbumName(prevName => event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    // build a formData object
    const formData = new FormData();
    formData.append('name', albumName);
    formData.append('parent_album_id', props.selectedAlbumId);
    
    //submit album post request to api
    props.setAlbumFetchParameters({
      url: `${BASE_URL}${POST_ALBUMS_ENDPOINT}`,
      method: 'POST',
      bodies: [formData],
    });
  }

  return (
    <ModalLayout close={props.close}>
      <div className="newAlbum">
        <h2 className="newAlbum__title">New Album</h2>
        <img
          src={xIcon}
          className="newAlbum__closeIcon"
          onClick={() => props.close()}
          alt="this is an X icon"
        ></img>
        <form 
          className="newAlbum__form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="name">
            Name:
          </label>
          <input 
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={albumName}
          ></input>

          <button
            type="submit"
            className="button"
          >
            Create Album
          </button>
        </form>
      </div>
    </ModalLayout>
  )
}
