import React from 'react';
import './MobileNavigationRootElement.css';
import MobileNavigationElement from './MobileNavigationElement';
import plusIcon from '../images/plus-icon-large.svg';
import minusIcon from '../images/minus-icon-large.svg';

export default function MobileNavigationRootElement(props) {
  const [areChildAlbumsDisplayed, setAreChildAlbumsDisplayed] = React.useState(false);

  const childAlbums = getChildAlbums(null).map(childAlbum => {
    return (
      <MobileNavigationElement
        id={childAlbum.id}
        getChildAlbums={getChildAlbums}
        getAlbumName={getAlbumName}
        getAlbumDepth={getAlbumDepth}
        clearImageData={props.clearImageData}
				setImageFetchParameters={props.setImageFetchParameters}
        setImageFilterText={props.setImageFilterText}
        setIsNavDisplayed={props.setIsNavDisplayed}
      />
    )
  });

  function getChildAlbums(albumId) {
		return props.albumData.filter(album => album.parent_album_id === albumId);
	}

	function getAlbumName(albumId) {
		if (albumId) {
			return props.albumData.filter(album => album.id === albumId)[0].name
		}
		else {
      return null;
    }
	}

	function getAlbumDepth(albumId, depth = 0) {
		const album = props.albumData.filter(album => album.id === albumId)[0];

		if (album) {
			return getAlbumDepth(album.parent_album_id, depth + 1);
		}
		else {
			return depth;
		}
	}

  function getIcon() {
    return areChildAlbumsDisplayed ? minusIcon : plusIcon
  }

  function handleIconClick(event) {
    setAreChildAlbumsDisplayed(!areChildAlbumsDisplayed)
  }

  function handleDocumentClick(event) {
    setAreChildAlbumsDisplayed(false);
  }

  function handleClick(event) {
    event.stopPropagation();
  }

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClick)

    return (() => {
      document.removeEventListener('click', handleDocumentClick)
    })
  })

  return (
    <>
      <div
        className="mobileNavigationRootElement"
        onClick={handleClick}
      >
        <p>
          {props.name}
        </p>
        { childAlbums.length > 0 &&
          <img
            src={getIcon()}
            className="mobileNavigationRootElement__icon"
            alt="this is an icon"
            onClick={handleIconClick}
          ></img>
        }
        { (props.isDesktopScreen && areChildAlbumsDisplayed) &&
          <div 
            className="mobileNavigationRootElement__elementContainer"
            onClick={handleClick}
          >
            {childAlbums}
          </div>
        }
      </div>
      { (!props.isDesktopScreen && areChildAlbumsDisplayed) &&
        <div
          className="mobileNavigationRootElement__elementContainer"
          onClick={handleClick}
        >
          {childAlbums}
        </div>
      }
    </>
  )
}