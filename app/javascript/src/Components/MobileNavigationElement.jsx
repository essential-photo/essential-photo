import React, { Children } from 'react';
import './MobileNavigationElement.css';
import plusIcon from '../images/plus-icon-large.svg';
import minusIcon from '../images/minus-icon-large.svg';

export default function MobileNavigationElement(props) {
  const [areChildAlbumsDisplayed, setAreChildAlbumsDisplayed] = React.useState(false)

  const childAlbums = props.getChildAlbums(props.id).map(childAlbum => {
    return (
      <MobileNavigationElement
        id={childAlbum.id}
        getChildAlbums={props.getChildAlbums}
        getAlbumName={props.getAlbumName}
        getAlbumDepth={props.getAlbumDepth}
      />
    )
  });

  const indentStyle = {
    paddingLeft: String(props.getAlbumDepth(props.id) * 10) + 'px'
  };

  function getIcon() {
    return areChildAlbumsDisplayed ? minusIcon : plusIcon
  }

  function handleClick(event) {
    setAreChildAlbumsDisplayed(!areChildAlbumsDisplayed)
  }

  return (
    <>
      <div 
        className="mobileNavigationElement"
        style={indentStyle}
      >
        <p>{props.getAlbumName(props.id)}</p>
        { childAlbums.length > 0 &&
          <img
            src={getIcon()}
            className="mobileNavigationElement__icon"
            alt="this is an icon"
            onClick={handleClick}
          ></img>
        }
      </div>
      { areChildAlbumsDisplayed && childAlbums }
    </>
  )
}