import React from 'react';
import './NavigationRootElement.css';
import NavigationElement from './NavigationElement';
import plusIcon from '../images/plus-icon-large.svg';
import minusIcon from '../images/minus-icon-large.svg';

export default function NavigationRootElement(props) {
  const [areChildAlbumsDisplayed, setAreChildAlbumsDisplayed] = React.useState(false);

  const childAlbums = getChildAlbums(null).map(childAlbum => {
    return (
      <NavigationElement
        id={childAlbum.id}
        getChildAlbums={getChildAlbums}
        getAlbumName={getAlbumName}
        getAlbumDepth={getAlbumDepth}
        clearImageData={props.clearImageData}
        addImageData={props.addImageData}
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
    // get the album depth in the albumData tree
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
    // stop event propogation so we can close nav when we click elsewhere 
    // in the document
    event.stopPropagation();
  }

  React.useEffect(() => {
    // add document event listener so we can close the navigation (if opened
    // on desktop) whenenever we click anywhere else on the page
    document.addEventListener('click', handleDocumentClick)

    return (() => {
      document.removeEventListener('click', handleDocumentClick)
    })
  }, [])

  return (
    <>
      <div
        className="navigationRootElement"
        onClick={handleClick}
      >
        <p>
          {props.name}
        </p>
        { childAlbums.length > 0 &&
          <img
            src={getIcon()}
            className="navigationRootElement__icon"
            alt="this is an icon"
            onClick={handleIconClick}
          ></img>
        }
        { (props.isDesktopScreen && areChildAlbumsDisplayed) &&
          <div 
            className="navigationRootElement__elementContainer"
            onClick={handleClick}
          >
            {childAlbums}
          </div>
        }
      </div>
      { (!props.isDesktopScreen && areChildAlbumsDisplayed) &&
        <div
          className="navigationRootElement__elementContainer"
          onClick={handleClick}
        >
          {childAlbums}
        </div>
      }
    </>
  )
}