import React from 'react';
import './NavigationElement.css';
import plusIcon from '../images/plus-icon-large.svg';
import minusIcon from '../images/minus-icon-large.svg';
import {
  BASE_URL, 
  IMAGES_INDEX_ENDPOINT_PUBLIC_IMAGES_ONLY,
  IMAGES_INDEX_ENDPOINT_BY_ALBUM_PUBLIC_IMAGES_ONLY
} from '../settings';
import useCallAPI from '../CustomHooks/useCallAPI';

export default function NavigationElement(props) {
  const [areChildAlbumsDisplayed, setAreChildAlbumsDisplayed] = React.useState(false);

  const {
    setFetchParameters: setImageFetchParameters,
    fetchResults: imageFetchResults,
    clearFetchResults: clearImageFetchResults
  } = useCallAPI();

  // when component first renders, clear fetch results
  React.useEffect(() => {
    if (imageFetchResults.length > 0) {
      clearImageFetchResults();
    }
  }, []);

  // handle fetch results
  if (imageFetchResults.length > 0) {
    if (imageFetchResults[0].responseStatus === 200) {
      props.addImageData(imageFetchResults[0].responseBody);
      clearImageFetchResults();
    }
  }

  const childAlbums = props.getChildAlbums(props.id).map(childAlbum => {
    return (
      <NavigationElement
        id={childAlbum.id}
        getChildAlbums={props.getChildAlbums}
        getAlbumName={props.getAlbumName}
        getAlbumDepth={props.getAlbumDepth}
        clearImageData={props.clearImageData}
        addImageData={props.addImageData}
        setImageFilterText={props.setImageFilterText}
        setIsNavDisplayed={props.setIsNavDisplayed}
      />
    )
  });

  const indentStyle = {
    // calculate indent padding based on album depth
    paddingLeft: String(props.getAlbumDepth(props.id) * 10) + 'px'
  };

  function getIcon() {
    return areChildAlbumsDisplayed ? minusIcon : plusIcon
  }

  function handleAlbumNameClick(event) {
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
    setImageFetchParameters({
      url: url,
      method: 'GET',
      bodies: [],
    });

    // close nav
    props.setIsNavDisplayed(false);
  }

  function handleIconClick(event) {
    setAreChildAlbumsDisplayed(!areChildAlbumsDisplayed)
  }

  return (
    <>
      <div 
        className="navigationElement"
        style={indentStyle}
      >
        <p
          className="navigationElement__albumName"
          onClick={handleAlbumNameClick}
        >
          {props.getAlbumName(props.id)}
        </p>
        { childAlbums.length > 0 &&
          <img
            src={getIcon()}
            className="navigationElement__icon"
            alt="this is an icon"
            onClick={handleIconClick}
          ></img>
        }
      </div>
      { areChildAlbumsDisplayed && childAlbums }
    </>
  )
}