import React from 'react';
import './AlbumCard.css';
import folderIcon from '../images/folder-icon.svg';
import dotsIcon from '../images/dots-icon.svg';

export default function AlbumCard(props) {
  return (
    <div className="albumCard">
      <img 
        src={folderIcon}
        className="albumCard__icon"
        alt="this is a folder icon"
      ></img>
      <span className="albumCard__name">{props.name}</span>
      <img
        src={dotsIcon}
        className="albumCard__icon"
        alt="this is a dots icon"
      ></img>
    </div>
  )
}
