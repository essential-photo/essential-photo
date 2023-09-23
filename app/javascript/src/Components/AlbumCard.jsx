import React from 'react';
import './AlbumCard.css';
import folderIcon from '../images/folder-icon.svg';
import dotsIcon from '../images/dots-icon.svg';
import {
  BASE_URL,
  IMAGES_INDEX_ENDPOINT_BY_ALBUM_PUBLIC_IMAGES_ONLY
} from '../settings';

export default function AlbumCard(props) {
  const [isAlbumClicked, setIsAlbumClicked] = React.useState(false);

  function handleClick(event) {
      setIsAlbumClicked(true);
  }

  React.useEffect(() => {
    if (isAlbumClicked) {
      // clear image data
      props.clearImageData();

      // set the selected album
      props.setSelectedAlbumId(props.id);

      setIsAlbumClicked(false);
    }
  }, [isAlbumClicked]);

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
