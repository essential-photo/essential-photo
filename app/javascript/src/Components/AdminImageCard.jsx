import React from 'react';
import './AdminImageCard.css';
import EditImage from './EditImage';
import Confirmation from './Confirmation';
import editIcon from '../images/pencil-icon.svg';
import deleteIcon from '../images/ph_trash.svg';

export default function AdminImageCard(props) {
  const [isEditHovered, setEditIsHovered] = React.useState(false);
  const [isDeleteHovered, setDeleteIsHovered] = React.useState(false);
  const [isEditImageDisplayed, setIsEditImageDisplayed] = React.useState(false);
  const [isDeleteConfirmationDisplayed, setIsDeleteConfirmationDisplayed] = React.useState(false);


  function getIconClass(isHovered) {
    if (isHovered) {
      return 'adminImageCard__icon adminImageCard__icon--hovered';
    }
    return 'adminImageCard__icon';
  }

  function closeEditImage() {
    setIsEditImageDisplayed(false);
  }

  function closeDeleteConfirmation() {
    setIsDeleteConfirmationDisplayed(false);
  }

  function handleConfirm() {
    setAlbumFetchParameters({
      url: `${BASE_URL}${DELETE_IMAGES_ENDPOINT}/${props.image.id}`,
      method: 'DELETE',
      bodies: []
    })
  }

  return (
    <>
      {isEditImageDisplayed &&
        <EditImage
          image={props.image}
          close={closeEditImage}
          updateImageData={props.updateImageData}
        />
      }
      {isDeleteConfirmationDisplayed &&
        <Confirmation 
          close={() => setIsConfirmationDisplayed(false)}
          handleConfirm={handleConfirm}
          id={props.id}
        />
      }

      <div className="adminImageCard">
        <div className="adminImageCard__wrapper">
          <div className="adminImageCard__imageContainer">
            <img
              src={props.image.thumbnail_url}
              className="adminImageCard__image"
              alt=""
            ></img>
          </div>
          <div className="adminImageCard__footer">
            <img
              src={editIcon}
              className={getIconClass(isEditHovered)}
              alt="this is an edit icon"
              onMouseEnter={() => { setEditIsHovered(true) }}
              onMouseLeave={() => { setEditIsHovered(false) }}
              onClick={() => setIsEditImageDisplayed(true)}
            ></img>
            <img
              src={deleteIcon}
              className={getIconClass(isDeleteHovered)}
              alt="this is a delete icon"
              onMouseEnter={() => { setDeleteIsHovered(true) }}
              onMouseLeave={() => { setDeleteIsHovered(false) }}
              onClick={() => setIsDeleteConfirmationDisplayed(true)}
            ></img>
          </div>
        </div>
      </div>
    </>
  )
}