import React from 'react';
import './VisitorHeader.css';
import plusIconLarge from '../images/plus-icon-large.svg';
import minusIconLarge from '../images/minus-icon-large.svg';
import Navigation from './Navigation';
import {DOMAIN_NAME, BASE_URL, IMAGES_INDEX_ENDPOINT_PUBLIC_IMAGES_ONLY} from '../settings';
import useCallAPI from '../CustomHooks/useCallAPI';

export default function VisitorHeader(props) {
  const [searchText, setSearchText] = React.useState('');
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);
  const [isNavDisplayed, setIsNavDisplayed] = React.useState(false);
  const [isDesktopScreen, setIsDesktopScreen] = React.useState(null);

  const {
    setFetchParameters: setImageFetchParameters,
    fetchResults: imageFetchResults,
    clearFetchResults: clearImageFetchResults
  } = useCallAPI();

  const navigation = (
    <Navigation
      clearImageData={props.clearImageData}
      addImageData={props.addImageData}
      albumData={props.albumData}
      setImageFilterText={props.setImageFilterText}
      setIsNavDisplayed={setIsNavDisplayed}
      isDesktopScreen={isDesktopScreen}
    />
  );

  function handleChange(event) {
    setSearchText(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    props.setImageFilterText(`Displaying images with tags: ${searchText}`);
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
      setImageFetchParameters({
        url: url,
        method: 'GET',
        bodies: [],
      });
    }

    setIsFormSubmitted(false);
  }, [isFormSubmitted])

  React.useEffect(() => {
    // after the image fetch finishes, store the image(s) in state
    if (imageFetchResults.length > 0) {
      const response = imageFetchResults[0].responseBody;
      props.addImageData(response);
      clearImageFetchResults();
    }
  }, [imageFetchResults]);

  React.useEffect(() => {
    function determineIfDesktopScreen(width) {
      if (width >= 700) {
        setIsDesktopScreen(true);
      }
      else {
        setIsDesktopScreen(false);
      }
    }

    function handleResize(event) {
      setIsNavDisplayed(false);
      determineIfDesktopScreen(event.target.innerWidth);
    }

    determineIfDesktopScreen(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  return (
    <header className="visitorHeader">
      <div className="visitorHeader__top">
        <h1 className="visitorHeader__title">{DOMAIN_NAME}</h1>
        { !isDesktopScreen &&
          <img 
            src={isNavDisplayed ? minusIconLarge : plusIconLarge}
            className="visitorHeader__icon"
            onClick={handleIconClick}
            alt="this is a plus icon"
          ></img>
        }
        { isDesktopScreen && navigation }
      </div>
      { (!isDesktopScreen && isNavDisplayed) && navigation }
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