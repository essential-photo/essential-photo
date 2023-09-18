import React from 'react';
import './BreadCrumb.css';
import houseIcon from '../images/house-icon.svg';
import greaterThanArrowIcon from '../images/greater-than-arrow-icon.svg';

export default function BreadCrumb(props) {
  const crumbs = props.getAlbumPath(props.selectedAlbumId).map(waypoint => {
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

  function handleClick(albumId) {
    props.clearImageData();
    props.setSelectedAlbumId(albumId);
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