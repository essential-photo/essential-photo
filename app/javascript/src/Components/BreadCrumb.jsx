import React from 'react';
import './BreadCrumb.css';
import houseIcon from '../images/house-icon.svg';
import greaterThanArrowIcon from '../images/greater-than-arrow-icon.svg';
import dotsIcon from '../images/dots-icon.svg';

export default function BreadCrumb(props) {
  let crumbs = [];
  const albumPath = props.getAlbumPath(props.selectedAlbumId);
  
  // Display the album path as breadcrumbs.
  // However, if we are more than 2 albums deep, render only the last 
  // 2 albums in the breadcrumbs, with '...' in the front
  if (albumPath.length <= 2) {
    crumbs = albumPath.map(waypoint => {
      return (
        <>
          <img
            src={greaterThanArrowIcon}
            className="breadCrumb__rightIcon"
            alt="this is a right arrow icon"
          ></img>
          <span
            className="breadCrumb__crumb"
            onClick={() => {handleClick(waypoint.id)}}
          >
            {waypoint.name}
          </span>
        </>
      )
    });
  } else {
    crumbs.push(
      <>
        <img
          src={dotsIcon}
          className="breadCrumb__dotsIcon"
          alt="this is a dots icon"
        ></img>
      </>
    )

    // add the last 2 albums
    crumbs.push(albumPath.slice(albumPath.length - 2, albumPath.length).map(waypoint => {
      return (
        <>
          <img
            src={greaterThanArrowIcon}
            className="breadCrumb__rightIcon"
            alt="this is a right arrow icon"
          ></img>
          <span
            className="breadCrumb__crumb"
            onClick={() => {handleClick(waypoint.id)}}
          >
            {waypoint.name}
          </span>
        </>
      )
    }));
  }
  
  function handleClick(albumId) {
    // only refresh if the clicked on album is different
    // from what's currently displayed
    if (props.selectedAlbumId != albumId) {
      props.clearImageData();
      props.clearAlbumData();
      props.setSelectedAlbumId(albumId);
    }
  }



  return (
    <div className="breadCrumb">
      <img
        src={houseIcon}
        className="breadCrumb__homeIcon"
        alt="this is a house icon"
        onClick={() => {handleClick(null)}}
      ></img>
      {crumbs}
    </div>
  )
}