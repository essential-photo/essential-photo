import React from 'react';
import './VisitorLayout.css';
import VisitorHeader from '../Components/VisitorHeader';

export default function VisitorLayout(props) {
  return (
    <div className="visitorLayout">
      <VisitorHeader
        clearImageData={props.clearImageData}
        setImageFetchParameters={props.setImageFetchParameters}
        albumData={props.albumData}
        setSearchInfoText={props.setSearchInfoText}
      />
      {props.children}
    </div>
  );
}