import React from 'react';
import './AlbumCard.css';
import folderIcon from '../images/folder-icon.svg';
import dotsIcon from '../images/dots-icon.svg';
import AlbumForm from './AlbumForm';

export default function AlbumCard(props) {
  const [isAlbumClicked, setIsAlbumClicked] = React.useState(false);
  const [areDotsHovered, setAreDotsHovered] = React.useState(false);
  const [isAlbumFormDisplayed, setIsAlbumFormDisplayed] = React.useState(false);

  const options = 
    <div
      onClick={(event) => {event.stopPropagation()}}
      className="albumCard__options"
    >
      <p
        className="albumCard__optionsText"
        onClick={handleEditAlbumClick}
      >
        Edit Album
      </p>
    </div>

  function handleAlbumCardClick(event) {
    setIsAlbumClicked(true);
  }

  function handleEditAlbumClick(event) {
    event.stopPropagation();
    props.setDisplayedOptionsId(null);
    setIsAlbumFormDisplayed(true);
  }

  function handleDotsClick(event) {
    event.stopPropagation();
    props.setDisplayedOptionsId(props.id);
  }
  
  function handleDocumentClick(event) {
    props.setDisplayedOptionsId(null);
  }

  function getDotsIconClass() {
    const baseClass = "albumCard__dotsIcon";

    if (areDotsHovered) {
      return baseClass + " " + "albumCard__dotsIcon--hovered";
    }
    else {
      return baseClass
    }
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

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return (() => {
      document.removeEventListener('click', handleDocumentClick);
    });
  }, []);
  
  return (
    <>
     {isAlbumFormDisplayed &&
        <AlbumForm 
          close={() => setIsAlbumFormDisplayed(false)}
          setAlbumFetchParameters = {props.setAlbumFetchParameters}
          albumFetchResults = {props.albumFetchResults}
          clearAlbumFetchResults = {props.clearAlbumFetchResults}
          selectedAlbumId = {props.selectedAlbumId}
          album = {{
            id: props.id,
            name: props.name
          }}
        />
      }
      <div
        className="albumCard"
        onClick={handleAlbumCardClick}
      >
        <img 
          src={folderIcon}
          className="albumCard__icon"
          alt="this is a folder icon"
        ></img>
        <span className="albumCard__name">{props.name}</span>
        <div
          className="albumCard__dotsIconContainer"
        >
          <img
            src={dotsIcon}
            className={getDotsIconClass()}
            onMouseEnter={() => {setAreDotsHovered(true)}}
            onMouseLeave={() => {setAreDotsHovered(false)}}
            onClick={handleDotsClick}
            alt="this is a dots icon"
          ></img>
          {(props.id === props.displayedOptionsId) && options}
        </div>
      </div>
    </>
  )
}
