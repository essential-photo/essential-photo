import React from 'react';
import './MobileNavigation.css';
import MobileNavigationRootElement from './MobileNavigationRootElement';

export default function MobileNavigation(props) {
	return (
		<div className='mobileNavigation'>
			<MobileNavigationRootElement
				name='Albums'
				albumData={props.albumData}
				clearImageData={props.clearImageData}
				setImageFetchParameters={props.setImageFetchParameters}
				setImageFilterText={props.setImageFilterText}
				setIsNavDisplayed={props.setIsNavDisplayed}
				isDesktopScreen={props.isDesktopScreen}
			/>
			<a href='' className="mobileNavigation__link">Links</a>
			<a href='' className="mobileNavigation__link">About</a>
		</div>
	)
}