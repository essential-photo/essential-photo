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
  const {
    isLoading: areImagesLoading,
    setFetchParameters: setImageFetchParameters,
    fetchResults: imageFetchResults,
    clearFetchResults: clearImageFetchResults
  } = useCallAPI();

  const {
    isLoading: areAlbumsLoading,
    setFetchParameters: setAlbumFetchParameters,
    fetchResults: albumFetchResults,
    clearFetchResults: clearAlbumFetchResults
  } = useCallAPI();

  const [imageData, setImageData] = React.useState([]);
  const [albumData, setAlbumData] = React.useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = React.useState(null);
  const [isAlbumFormDisplayed, setIsAlbumFormDisplayed] = React.useState(false);
  const [isRefreshed, setIsRefreshed] = React.useState(false);

  const fileInputEl = React.useRef(null);
  const childAlbums = getChildAlbums(selectedAlbumId);

  // when the component renders initially, clear any fetchResults,
  useEffect(() => {
    clearAlbumFetchResults();
    clearImageFetchResults();
  }, []);

  // reload images/albums when the selected album changes
  useEffect(() => {
    clearImageData();
    clearAlbumData();
    getImagesAndAlbums();
  }, [selectedAlbumId]);

  // reload images/albums when a refresh is called
  useEffect(() => {
    if (isRefreshed) {
      clearImageData();
      clearAlbumData();
      getImagesAndAlbums();
      setIsRefreshed(false);
    }
  }, [isRefreshed]);

  // handle image fetch results
  if (imageFetchResults.length > 0) {
    if (imageFetchResults[0].responseStatus === 200 || imageFetchResults[0].responseStatus === 201) {
      addImageData(imageFetchResults[0].responseBody);
      clearImageFetchResults();
    }
  }

  // handle album fetch results
  if (albumFetchResults.length > 0) {
    if (albumFetchResults[0].responseStatus === 200) {
      addAlbumData(albumFetchResults[0].responseBody);
      clearAlbumFetchResults();
    }
  }

  function getImagesAndAlbums() {
    setAlbumFetchParameters({
      url: `${BASE_URL}${ALBUMS_INDEX_ENDPOINT}`,
      method: 'GET',
      bodies: [],
    })

    setImageFetchParameters({
      url: `${BASE_URL}${IMAGES_INDEX_ENDPOINT_BY_ALBUM_PUBLIC_IMAGES_ONLY}${selectedAlbumId}`,
      method: 'GET',
      bodies: [],
    });
  }

  function clearImageData() {
    setImageData([]);
  }

  function clearAlbumData() {
    setAlbumData([]);
  }

  function deleteImageData(imageId) {

    setImageData(prevData => {
      return prevData.filter(((image) => image.id != imageId));
    });
  }

  function updateImageData(data) {
    // manually update object in data array
    setImageData(prevData => {
      return prevData.map(item => {
        if (item.id === data.id) {
          return data;
        }
        else {
          return item;
        }
      });
    });
  }

  function updateAlbumData(data) {
    // manually update object in data array
    setAlbumData(prevData => {
      return prevData.map(item => {
        if (item.id === data.id) {
          return data;
        }
        else {
          return item;
        }
      });
    });
  }

  function getChildAlbums(albumId) {
    return albumData.filter(album => album.parent_album_id === albumId);
  }

  function getAlbumPath(albumId) {
    let albumPath = [];
    let currentAlbumId = albumId;
    let currentAlbum;

    if (albumData.length > 0) {
      while (currentAlbumId) {
        currentAlbum = albumData.find(album => album.id === currentAlbumId);
        albumPath.push(currentAlbum);
        currentAlbumId = currentAlbum.parent_album_id;
      }
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
      formData.append('parent_album_id', selectedAlbumId);
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

  function addAlbumData(data) {
    setAlbumData(prevData => {
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
              {isAlbumFormDisplayed &&
                <AlbumForm
                  close={() => setIsAlbumFormDisplayed(false)}
                  selectedAlbumId={selectedAlbumId}
                  addAlbumData={addAlbumData}
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
                clearAlbumData={clearAlbumData}
              />
              {selectedAlbumId &&
                <div className="adminImages__back" onClick={handleBackClick}>
                  <img src={lessThanArrowIcon} alt="this is a less than arrow icon"></img>
                  <span>Back</span>
                </div>
              }
            </div>
          </header>
          <DragDrop
            imageData={imageData}
            addImageData={addImageData}
            deleteImageData={deleteImageData}
            updateImageData={updateImageData}
            addAlbumData={addAlbumData}
            updateAlbumData={updateAlbumData}
            areImagesLoading={areImagesLoading}
            clearImageData={clearImageData}
            clearAlbumData={clearAlbumData}
            areAlbumsLoading={areAlbumsLoading}
            childAlbums={childAlbums}
            setSelectedAlbumId={setSelectedAlbumId}
            selectedAlbumId={selectedAlbumId}
            setIsRefreshed={setIsRefreshed}
          />
        </main>
      </AdminLayout>
    </>
  )
}