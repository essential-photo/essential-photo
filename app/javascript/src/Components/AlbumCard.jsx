import React from 'react';
import './AlbumCard.css';
import folderIcon from '../images/folder-icon.svg';
import dotsIcon from '../images/dots-icon.svg';
import {
  BASE_URL,
  IMAGES_INDEX_ENDPOINT_BY_ALBUM_PUBLIC_IMAGES_ONLY
} from '../settings';

export default function AlbumCard(props) {
  const [isAlbumDoubleClicked, setIsAlbumDoubleClicked] = React.useState(false);

  let previousClickTimestamp = null;

  function handleClick(event) {
    // if there is a previous click timestamp, 
    // and it was clicked less than 300ms ago,
    // then we have a double click
    if (previousClickTimestamp) {
      if ((event.timeStamp - previousClickTimestamp) < 300) {
        setIsAlbumDoubleClicked(true);
      }
    }

    previousClickTimestamp = event.timeStamp;
  }

  React.useEffect(() => {
    console.log('use effect');
    if (isAlbumDoubleClicked) {
      // clear image data
      props.clearImageData();

      // set the selected album
      props.setSelectedAlbumId(props.id);

      setIsAlbumDoubleClicked(false);
    }
  }, [isAlbumDoubleClicked]);

  return (
    <div
      className="albumCard"
      onClick={handleClick}
    >
      <img 
        src={folderIcon}
        className="albumCard__icon"
        alt="this is a folder icon"
      ></img>
      <span className="albumCard__name">{props.name}</span>
      <img
        src={dotsIcon}
        className="albumCard__icon"
        alt="this is a dots icon"
      ></img>
    </div>
  )
}
