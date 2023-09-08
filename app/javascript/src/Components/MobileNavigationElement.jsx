import React from 'react';
import './MobileNavigationElement.css';
import plusIcon from '../images/plus-icon-large.svg';
import minusIcon from '../images/minus-icon-large.svg';
import {
  BASE_URL, 
  IMAGES_INDEX_ENDPOINT_PUBLIC_IMAGES_ONLY,
  IMAGES_INDEX_ENDPOINT_BY_ALBUM_PUBLIC_IMAGES_ONLY
} from '../settings';

export default function MobileNavigationElement(props) {
  const [areChildAlbumsDisplayed, setAreChildAlbumsDisplayed] = React.useState(false);
  const [isAlbumNameClicked, setIsAlbumNameClicked] = React.useState(false);

  const childAlbums = props.getChildAlbums(props.id).map(childAlbum => {
    return (
      <MobileNavigationElement
        id={childAlbum.id}
        getChildAlbums={props.getChildAlbums}
        getAlbumName={props.getAlbumName}
        getAlbumDepth={props.getAlbumDepth}
        clearImageData={props.clearImageData}
				setImageFetchParameters={props.setImageFetchParameters}
        setImageFilterText={props.setImageFilterText}
        setIsNavDisplayed={props.setIsNavDisplayed}
      />
    )
  });

  const indentStyle = {
    paddingLeft: String(props.getAlbumDepth(props.id) * 10) + 'px'
  };

  function getIcon() {
    return areChildAlbumsDisplayed ? minusIcon : plusIcon
  }

  function handleAlbumNameClick(event) {
    setIsAlbumNameClicked(true);
  }

  function handleIconClick(event) {
    setAreChildAlbumsDisplayed(!areChildAlbumsDisplayed)
  }

  React.useEffect(() => {
    if (isAlbumNameClicked) {
      // clear currently displayed images
      props.clearImageData();

      let url = '';

      // if the clicked album is a non-root album
      if (props.id) {
        url = `${BASE_URL}${IMAGES_INDEX_ENDPOINT_BY_ALBUM_PUBLIC_IMAGES_ONLY}${props.id}`
        props.setImageFilterText(`Displaying images from album: ${props.getAlbumName(props.id)}`);
      }
      // if the clicked album is the root album ('Albums')
      else {
        url = `${BASE_URL}${IMAGES_INDEX_ENDPOINT_PUBLIC_IMAGES_ONLY}`;
        props.setImageFilterText('');
      }

      // send image fetch request
      props.setImageFetchParameters({
        url: url,
        method: 'GET',
        bodies: [],
      });

      // close nav
      props.setIsNavDisplayed(false);
    }

    setIsAlbumNameClicked(false);
  }, [isAlbumNameClicked])

  return (
    <>
      <div 
        className="mobileNavigationElement"
        style={indentStyle}
      >
        <p
          className="mobileNavigationElement__albumName"
          onClick={handleAlbumNameClick}
        >
          {props.getAlbumName(props.id)}
        </p>
        { childAlbums.length > 0 &&
          <img
            src={getIcon()}
            className="mobileNavigationElement__icon"
            alt="this is an icon"
            onClick={handleIconClick}
          ></img>
        }
      </div>
      { areChildAlbumsDisplayed && childAlbums }
    </>
  )
}