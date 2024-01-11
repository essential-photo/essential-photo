import React from 'react';
import './AlbumCard.css';
import folderIcon from '../images/folder-icon.svg';
import dotsIcon from '../images/dots-icon.svg';
import AlbumForm from './AlbumForm';
import Confirmation from './Confirmation';
import useCallAPI from '../CustomHooks/useCallAPI';
import {BASE_URL, DELETE_ALBUMS_ENDPOINT} from '../settings';

export default function AlbumCard(props) {
  const [areDotsHovered, setAreDotsHovered] = React.useState(false);
  const [isAlbumFormDisplayed, setIsAlbumFormDisplayed] = React.useState(false);
  const [isConfirmationDisplayed, setIsConfirmationDisplayed] = React.useState(false);

  const {
    setFetchParameters: setAlbumFetchParameters,
    fetchResults: albumFetchResults,
    clearFetchResults: clearAlbumFetchResults
  } = useCallAPI();

  // clear any fetch results on initial component render
  React.useEffect(() => {
    if (albumFetchResults.length > 0) {
      clearAlbumFetchResults();
    }
  }, [])

  // handle fetch response
  if (albumFetchResults.length > 0) {
    if (albumFetchResults[0].responseStatus === 200) {
      props.setIsRefreshed(true);
      setIsConfirmationDisplayed(false);
      clearAlbumFetchResults();
    }
  }

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
      <p
        className="albumCard__optionsText"
        onClick={handleDeleteAlbumClick}
      >
        Delete Album
      </p>
    </div>

  function handleConfirm() {
    setAlbumFetchParameters({
      url: `${BASE_URL}${DELETE_ALBUMS_ENDPOINT}/${props.id}`,
      method: 'DELETE',
      bodies: []
    })
  }

  function handleAlbumCardClick(event) {
    props.setSelectedAlbumId(props.id);
  }

  function handleEditAlbumClick(event) {
    event.stopPropagation();
    props.setDisplayedOptionsId(null);
    setIsAlbumFormDisplayed(true);
  }

  function handleDeleteAlbumClick(event) {
    event.stopPropagation();
    props.setDisplayedOptionsId(null);
    setIsConfirmationDisplayed(true);
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
          addAlbumData = {props.addAlbumData}
          updateAlbumData = {props.updateAlbumData}
          selectedAlbumId = {props.selectedAlbumId}
          album = {{
            id: props.id,
            name: props.name
          }}
        />
      }
      {isConfirmationDisplayed &&
        <Confirmation 
          close={() => setIsConfirmationDisplayed(false)}
          handleConfirm={handleConfirm}
          id={props.id}
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
