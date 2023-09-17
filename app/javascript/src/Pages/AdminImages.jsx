import React, { useEffect } from 'react';
import './AdminImages.css';
import AdminLayout from '../Layouts/AdminLayout';
import plusIcon from '../images/plus-icon.svg';
import DragDrop from '../Components/DragDrop';
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

  const {
      data: imageData,
      isLoading: areImagesLoading,
      updateDataItem: updateImage,
      setFetchParameters: setImageFetchParameters
  } = useCallAPI();

  const {
    data: albumData,
    isLoading: areAlbumsLoading,
    setFetchParameters: setAlbumFetchParameters
  } = useCallAPI();

  const fileInputEl = React.useRef(null);
  const childAlbums = getChildAlbums(selectedAlbumId);

  function getChildAlbums(albumId) {
    return albumData.filter(album => album.parent_album_id === albumId);
  }

  function handleClick(event) {
    fileInputEl.current.click();
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
    // when page first loads, load root albums 
    // and root images (images not belonging to an album)
    setImageFetchParameters({
      url: `${BASE_URL}${IMAGES_INDEX_ENDPOINT_BY_ALBUM_PUBLIC_IMAGES_ONLY}null`,
      method: 'GET',
      bodies: [],
    });

    setAlbumFetchParameters({
      url: `${BASE_URL}${ALBUMS_INDEX_ENDPOINT}`,
      method: 'GET',
      bodies: [],
    })
  }, [setImageFetchParameters, setAlbumFetchParameters]);

  return (
    <>
      <AdminLayout hasHeader={true}>
        <main className="adminImages">
          <header className="adminImages__header">
            <h3 className="adminImages__title">Images</h3>
            <button className="button" onClick={handleClick}>
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
          </header>
          <DragDrop
            imageData={imageData}
            areImagesLoading={areImagesLoading}
            setImageFetchParameters={setImageFetchParameters}
            updateImage={updateImage}
            areAlbumsLoading={areAlbumsLoading}
            childAlbums={childAlbums}
          />
        </main>
      </AdminLayout>
    </>
  )
}