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
    fetchResults: imageFetchResults
  } = useCallAPI();
  const {
    setFetchParameters: setAlbumFetchParameters,
    fetchResults: albumFetchResults
  } = useCallAPI();
  const [imageData, setImageData] = React.useState([]);
  const [albumData, setAlbumData] = React.useState([]);
  const [displayedImage, setDisplayedImage] = React.useState(null);
  const [imageFilterText, setImageFilterText] = React.useState('');

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

  useEffect(() => {
    // on initial page load, fetch photos and albums
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
  }, [setImageFetchParameters, setAlbumFetchParameters]);

  useEffect(() => {
    // after the image fetch finishes, store the images in state
    if (imageFetchResults.length > 0) {
      setImageData(imageFetchResults[0].responseBody);
    }
  }, [imageFetchResults])

  useEffect(() => {
    // after the album fetch finishes, store the albums in state
    if (albumFetchResults.length > 0) {
      setAlbumData(albumFetchResults[0].responseBody);
    }
  }, [albumFetchResults])

  return (
    <VisitorLayout
      clearImageData = {clearImageData}
      setImageFetchParameters={setImageFetchParameters}
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