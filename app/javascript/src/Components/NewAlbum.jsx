import React from 'react';
import './NewAlbum.css';
import ModalLayout from '../Layouts/ModalLayout';

export default function NewAlbum(props) {
  const [albumName, setAlbumName] = React.useState('');

  function handleChange(event) {
    setAlbumName(prevName => event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <ModalLayout close={props.close}>
      <div className="newAlbum">
        <h2 className="newAlbum__title">New Album</h2>
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
