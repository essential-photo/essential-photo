import React, { useEffect } from 'react';
import './AdminImages.css';
import AdminLayout from '../Layouts/AdminLayout';
import plusIcon from '../images/plus-icon.svg';
import lessThanArrowIcon from '../images/less-than-arrow-icon.svg';
import DragDrop from '../Components/DragDrop';
import BreadCrumb from '../Components/BreadCrumb';
import AlbumForm from '../Components/AlbumForm';
import {
  BASE_URL,
  POST_IMAGES_ENDPOINT,
  ALBUMS_INDEX_ENDPOINT,
  IMAGES_INDEX_ENDPOINT_BY_ALBUM_PUBLIC_IMAGES_ONLY,
  VALID_UPLOAD_FILE_TYPES
} from '../settings';
import useCallAPI from '../CustomHooks/useCallAPI';

export default function AdminImages() { 
  const [selectedAlbumId, setSelectedAlbumId] = React.useState(null);
  const [isAlbumFormDisplayed, setIsAlbumFormDisplayed] = React.useState(false);

  const {
    data: imageData,
    isLoading: areImagesLoading,
    clearData: clearImageData,
    setFetchParameters: setImageFetchParameters,
    fetchResults: imageFetchResults,
    clearFetchResults: clearImageFetchResults,
  } = useCallAPI();

  const {
    data: albumData,
    isLoading: areAlbumsLoading,
    fetchResults: albumFetchResults,
    clearFetchResults: clearAlbumFetchResults,
    setFetchParameters: setAlbumFetchParameters,
  } = useCallAPI();

  const fileInputEl = React.useRef(null);
  const childAlbums = getChildAlbums(selectedAlbumId);

  function getChildAlbums(albumId) {
    return albumData.filter(album => album.parent_album_id === albumId);
  }

  function getAlbumPath(albumId) {
    let albumPath = [];
    let currentAlbumId = albumId;
    let currentAlbum;

    while (currentAlbumId) {
      currentAlbum = albumData.find(album => album.id === currentAlbumId);
      albumPath.push(currentAlbum);
      currentAlbumId = currentAlbum.parent_album_id;
    }
 
    return albumPath.reverse();
  }

  function handleAddImagesClick(event) {
    fileInputEl.current.click();
  }

  function handleBackClick() {
    let parentAlbumId = albumData.filter(album => album.id === selectedAlbumId)[0].parent_album_id;

    clearImageData();
    setSelectedAlbumId(parentAlbumId);
  }

  function handleCreateAlbumClick() {
    setIsAlbumFormDisplayed(true);
  }

  function handleChange(event) {
    const files = [...event.target.files];

    // remove any non-image files
    const imageFiles = files.filter(file => {
      return VALID_UPLOAD_FILE_TYPES.includes(file.type);
    });

    // build a formData object for each file
    const formDatas = imageFiles.map(file => {
      const formData = new FormData();
      formData.append('image', file);
      return formData;
    });

    // initiate file upload
    setImageFetchParameters({
      url: `${BASE_URL}${POST_IMAGES_ENDPOINT}`,
      method: 'POST',
      bodies: formDatas,
    });

    // reset file input value
    event.target.value = null;
  }

  useEffect(() => {
    setImageFetchParameters({
      url: `${BASE_URL}${IMAGES_INDEX_ENDPOINT_BY_ALBUM_PUBLIC_IMAGES_ONLY}${selectedAlbumId}`,
      method: 'GET',
      bodies: [],
    });
  }, [setImageFetchParameters, selectedAlbumId]);

  useEffect(() => {
    setAlbumFetchParameters({
      url: `${BASE_URL}${ALBUMS_INDEX_ENDPOINT}`,
      method: 'GET',
      bodies: [],
    })
  }, [setAlbumFetchParameters]);

  // clear image fetch results
  useEffect(() => {
    if (imageFetchResults.length > 0) {
      console.log('AdminImages: clearing image fetch results');
      clearImageFetchResults();
    }
  }, [imageFetchResults])

  // clear album fetch results
  useEffect(() => {
    if (albumFetchResults.length > 0) {
      console.log('AdminImages: clearing album fetch results');
      clearAlbumFetchResults();
    }
  }, [albumFetchResults])

  console.log('AdminImages rendered');

  return (
    <>
      <AdminLayout hasHeader={true}>
        <main className="adminImages">
          <header className="adminImages__header">
            <div className="adminImages__buttonContainer">
              <button className="button button--active adminImages__button" onClick={handleAddImagesClick}>
                <img src={plusIcon} className="button__icon" alt="this is a plus icon"></img>
                <p>Add Images</p>
              </button>
              <input
                type="file"
                multiple
                ref={fileInputEl}
                className="adminImages__fileInput"
                accept=".png, .jpg, .jpeg"
                onChange={handleChange}
              ></input>
              <button className="button button--active adminImages__button" onClick={handleCreateAlbumClick}>
                <img src={plusIcon} className="button__icon" alt="this is a plus icon"></img>
                <p>Create Album</p>
              </button>
              { isAlbumFormDisplayed &&
                <AlbumForm 
                  close={() => setIsAlbumFormDisplayed(false)}
                  setAlbumFetchParameters = {setAlbumFetchParameters}
                  selectedAlbumId = {selectedAlbumId}
                  albumFetchResults = {albumFetchResults}
                  clearAlbumFetchResults = {clearAlbumFetchResults}
                  album={null}
                />
              }
            </div>
            <div className="adminImages__navContainer">
              <BreadCrumb 
                selectedAlbumId={selectedAlbumId}
                setSelectedAlbumId={setSelectedAlbumId}
                getAlbumPath={getAlbumPath}
                clearImageData={clearImageData}
              />
              { selectedAlbumId &&
                <div className="adminImages__back" onClick={handleBackClick}>
                  <img src={lessThanArrowIcon} alt="this is a less than arrow icon"></img>
                  <span>Back</span>
                </div>
              }
            </div>
          </header>
          <DragDrop
            imageData={imageData}
            areImagesLoading={areImagesLoading}
            setImageFetchParameters={setImageFetchParameters}
            clearImageData={clearImageData}
            areAlbumsLoading={areAlbumsLoading}
            childAlbums={childAlbums}
            setSelectedAlbumId={setSelectedAlbumId}
            selectedAlbumId={selectedAlbumId}
            setAlbumFetchParameters = {setAlbumFetchParameters}
            albumFetchResults = {albumFetchResults}
            clearAlbumFetchResults = {clearAlbumFetchResults}
          />
        </main>
      </AdminLayout>
    </>
  )
}