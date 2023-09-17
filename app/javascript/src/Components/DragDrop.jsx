import React from 'react';
import './DragDrop.css';
import AdminImageCard from './AdminImageCard';
import AlbumCard from './AlbumCard';
import {BASE_URL, POST_IMAGES_ENDPOINT} from '../settings';
import {VALID_UPLOAD_FILE_TYPES} from '../settings';
import { checkPropTypes } from 'prop-types';

export default function DragDrop(props) {
  const adminImages = props.imageData.map(image => {
    return (
      <AdminImageCard
        key={image.id}
        image={image}
        updateImage={props.updateImage}
      />
    );
  });

  const albums = props.childAlbums.map(childAlbum => {
    return (
      <AlbumCard
        id={childAlbum.id}
        name={childAlbum.name}
        setImageFetchParameters={props.setImageFetchParameters}
        clearImageData={props.clearImageData}
        setSelectedAlbumId={props.setSelectedAlbumId}
      />
    )
  });

  function handleDragEnter(event) {
    event.preventDefault();
  }

  function handleDragLeave(event) {
    event.preventDefault();
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();

    const files = [...event.dataTransfer.files];

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
    props.setImageFetchParameters({
      url: `${BASE_URL}${POST_IMAGES_ENDPOINT}`,
      method: 'POST',
      bodies: formDatas,
    });
  }

  return (
    <div className="dragDrop">
      <div className="dragDrop__innerContainer"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="dragDrop__heading">Albums</p>
        <div className="dragDrop__albumsContainer">
          {albums.length > 0 ?
            albums
          :
            <p>No albums yet</p>
          }
        </div>
        <p className="dragDrop__heading">Images</p>
        <div className="dragDrop__imagesContainer">
          {adminImages.length > 0 ?
            adminImages
          :
            <p>No images yet</p>
          }
        </div>
        {(props.areImagesLoading || props.areAlbumsLoading) &&
          <div className="dragDrop__overlay">
            <h1>Loading...</h1>
          </div>
        }
      </div>
    </div>
  );
}