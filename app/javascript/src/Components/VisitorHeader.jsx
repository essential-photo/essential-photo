import React from 'react';
import './VisitorHeader.css';
import plusIconLarge from '../images/plus-icon-large.svg';
import minusIconLarge from '../images/minus-icon-large.svg';
import MobileNavigation from './MobileNavigation';
import {DOMAIN_NAME, BASE_URL, IMAGES_INDEX_ENDPOINT_PUBLIC_IMAGES_ONLY} from '../settings';

export default function VisitorHeader(props) {
  const [searchText, setSearchText] = React.useState('');
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);
  const [isNavDisplayed, setIsNavDisplayed] = React.useState(false);

  function handleChange(event) {
    setSearchText(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    props.setSearchInfoText(searchText);
    setIsFormSubmitted(true);
  }

  function handleIconClick() {
    setIsNavDisplayed(!isNavDisplayed);
  }

  React.useEffect(() => {
    if (isFormSubmitted) {
      // clear existing images in state
      props.clearImageData();

      let url = `${BASE_URL}${IMAGES_INDEX_ENDPOINT_PUBLIC_IMAGES_ONLY}`

      // only 'tags' query parameter if search text isn't blank
      if (searchText) {
        url = url + `?tags=${searchText}`;
      }

      // submit GET request to API
      props.setImageFetchParameters({
        url: url,
        method: 'GET',
        bodies: [],
      });
    }

    setIsFormSubmitted(false);
  }, [isFormSubmitted])

  return (
    <header className="visitorHeader">
      <div className="visitorHeader__top">
      <h1 className="visitorHeader__title">{DOMAIN_NAME}</h1>
        <img 
          src={isNavDisplayed ? minusIconLarge : plusIconLarge}
          className="visitorHeader__icon"
          onClick={handleIconClick}
          alt="this is a plus icon"
        ></img>
      </div>
      {
        isNavDisplayed && 
        <MobileNavigation albumData={props.albumData}/>
      }
      <div className="visitorHeader__search">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="visitorHeader__input"
            placeholder="Search by tag"
            onChange={handleChange}
            value={searchText}
          ></input>
        </form>
        <p className="visitorHeader__inputInfo">
          SEPARATE TAGS WITH A COMMA
        </p>
      </div>
    </header>
  );
}