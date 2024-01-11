import React from 'react';
import './VisitorLayout.css';
import VisitorHeader from '../Components/VisitorHeader';

export default function VisitorLayout(props) {
  return (
    <div className="visitorLayout">
      <VisitorHeader
        clearImageData={props.clearImageData}
        addImageData={props.addImageData}
        albumData={props.albumData}
        setImageFilterText={props.setImageFilterText}
      />
      {props.children}
    </div>
  );
}