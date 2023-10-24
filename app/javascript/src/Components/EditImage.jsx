import React, { useEffect } from 'react';
import './EditImage.css';
import ModalLayout from '../Layouts/ModalLayout';
import xIcon from '../images/x-icon.svg';
import {BASE_URL, UPDATE_IMAGE_ENDPOINT} from '../settings';
import useCallAPI from '../CustomHooks/useCallAPI';

export default function EditImage(props) {
  const {
    isLoading: areImagesLoading,
    setFetchParameters: setImageFetchParameters,
    fetchResults: imageFetchResults,
    clearFetchResults: clearImageFetchResults
  } = useCallAPI();

  const [imageFormData, setImageFormData] = React.useState({
    title: props.image.title,
    description: props.image.description,
    tags: props.image.tags.map(tag => tag.name),
    isPublic: props.image.is_public,
  })

  function handleChange(event) {
    setImageFormData(prevData => {
      if (event.target.id === 'isPublic') {
        // handle isPublic checkbox toggling
        return {...prevData, isPublic: !prevData.isPublic}
      }
      // handle text box inputs
      return {...prevData, [event.target.id]: event.target.value} 
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    // build a formData object
    const formData = new FormData();
    formData.append('title', imageFormData.title);
    formData.append('description', imageFormData.description);
    formData.append('tags', imageFormData.tags);
    formData.append('is_public', imageFormData.isPublic);
    formData.append('parent_album_id', props.image.parent_album_id);
    
    //submit image update request to api
    setImageFetchParameters({
      url: `${BASE_URL}${UPDATE_IMAGE_ENDPOINT}/${props.image.id}`,
      method: 'PATCH',
      bodies: [formData],
    });
  }

  useEffect(() => {
    // after the image fetch finishes, update the image in state
    if (imageFetchResults.length > 0) {
      const response = imageFetchResults[0].responseBody;
      props.updateImageData(response);
      clearImageFetchResults();
    }
  }, [imageFetchResults])
  
  return (
    <ModalLayout close={props.close} dark={true}>
      <main className="editImage">
        {areImagesLoading &&
          <div className="editImage__overlay">
            <h1>Loading...</h1>
          </div>
        }
        <div className="editImage__paddingContainer">
          <h2 className="editImage__title">Edit Image</h2>
          <img
            src={xIcon}
            className="editImage__closeIcon"
            alt="this is an x icon"
            onClick={props.close}
          ></img>
          <div className="editImage__imageContainer">
            <img
              src={props.image.thumbnail_url}
              className="editImage__image"
              alt=""
            ></img>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="editImage__formFieldsContainer">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                className="editImage__input"
                id="title"
                name="title"
                value={imageFormData.title ? imageFormData.title : ''}
                onChange={handleChange}
              ></input>

              <label htmlFor="description">Description:</label>
              <input
                type="text"
                className="editImage__input"
                id="description"
                name="description"
                value={imageFormData.description ? imageFormData.description : ''}
                onChange={handleChange}
              ></input>

              <label htmlFor="tags">Tags:</label>
              <input
                type="text"
                className="editImage__input"
                id="tags"
                name="tags"
                value={imageFormData.tags ? imageFormData.tags : ''}
                onChange={handleChange}
              ></input>

              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={imageFormData.isPublic ? 'checked' : ''}
                onChange={handleChange}
              ></input>
              <label htmlFor="isPublic">Is Public</label>
            </div>
            <button type="submit" className="button button--active button--wide">Update Image</button>
          </form>
        </div>
      </main>
    </ModalLayout>
  );
}