import React, { useEffect } from 'react';
import './Images.css';
import VisitorLayout from '../Layouts/VisitorLayout';
import ShowImage from '../Components/ShowImage';
import useCallAPI from '../CustomHooks/useCallAPI';
import {
    BASE_URL,
    IMAGES_INDEX_ENDPOINT_PUBLIC_IMAGES_ONLY,
    ALBUMS_INDEX_ENDPOINT
} from '../settings';

export default function Images() {
  const {
    setFetchParameters: setImageFetchParameters,
    fetchResults: imageFetchResults,
    clearFetchResults: clearImageFetchResults
  } = useCallAPI();

  const {
    setFetchParameters: setAlbumFetchParameters,
    fetchResults: albumFetchResults,
    clearFetchResults: clearAlbumFetchResults
  } = useCallAPI();

  const [imageData, setImageData] = React.useState([]);
  const [albumData, setAlbumData] = React.useState([]);
  const [displayedImage, setDisplayedImage] = React.useState(null);
  const [imageFilterText, setImageFilterText] = React.useState('');

  // when component first renders, clear any fetch results
  // and fetch images and albums
  useEffect(() => {
    clearImageFetchResults();
    clearAlbumFetchResults();

    setImageFetchParameters({
      url: `${BASE_URL}${IMAGES_INDEX_ENDPOINT_PUBLIC_IMAGES_ONLY}`,
      method: 'GET',
      bodies: [],
    });

    setAlbumFetchParameters({
      url: `${BASE_URL}${ALBUMS_INDEX_ENDPOINT}`,
      method: 'GET',
      bodies: [],
    });
  }, []);

  // handle image fetch results
  if (imageFetchResults.length > 0) {
    if (imageFetchResults[0].responseStatus === 200) {
      addImageData(imageFetchResults[0].responseBody);
      clearImageFetchResults();
    }
  }

  // handle album fetch results
  if (albumFetchResults.length > 0) {
    if (albumFetchResults[0].responseStatus === 200) {
      setAlbumData(albumFetchResults[0].responseBody);
      clearAlbumFetchResults();
    }
  }

  const images = imageData.map(image => {
    return (
      <div className="images__imageContainer" key={image.id}>
        <img
          src={image.thumbnail_url}
          id={image.id}
          className="images__image"
          alt=""
          onClick={handleClick}
        ></img>
      </div>
    );
  });

  function handleClick(event) {
    // display the fullsized image
    imageData.forEach(image => {
      if (image.id === parseInt(event.target.id)) {
        setDisplayedImage(image);
      }
    });
  }

  function closeDisplayedImage() {
    setDisplayedImage(null);
  }

  function clearImageData() {
    setImageData([]);
  }

  function addImageData(data) {
    setImageData(prevData => {
      const tempData = prevData.slice(0);

      if (Array.isArray(data)) {
        data.forEach(item => tempData.push(item));
      }
      else {
        tempData.push(data);
      }

      return tempData;
    })
  }

  function setPreviousImage() {
    // set the displayed image to the previous
    // image in the imageData array
    let previousImage;
    const currentImageIndex = imageData.indexOf(displayedImage);

    // when the first image is reached, loop
    // to the last image
    if (currentImageIndex === 0) {
      previousImage = imageData[imageData.length - 1];
    }
    else {
      previousImage = imageData[currentImageIndex - 1];
    }
  
    setDisplayedImage(previousImage);
  }

  function setNextImage() {
    // set the displayed image to the next
    // image in the imageData array
    let nextImage;
    const currentImageIndex = imageData.indexOf(displayedImage);

    // when the last image is reached, loop
    // to the first image
    if (currentImageIndex === (imageData.length - 1)) {
      nextImage = imageData[0];
    }
    else {
      nextImage = imageData[currentImageIndex + 1];
    }
    
    setDisplayedImage(nextImage);
  }

  return (
    <VisitorLayout
      clearImageData = {clearImageData}
      addImageData = {addImageData}
      albumData = {albumData}
      setImageFilterText={setImageFilterText}
    >
      {displayedImage && 
        <ShowImage
          image={displayedImage}
          close={closeDisplayedImage}
          setPreviousImage={setPreviousImage}
          setNextImage={setNextImage}
        />
      }
      {imageFilterText &&
        <p className="images__filterText">
          {imageFilterText}
        </p>
      }
      <main className="images">
        {images}
      </main>
    </VisitorLayout>
  );
}