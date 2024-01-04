import React from 'react';
import './Navigation.css';
import NavigationRootElement from './NavigationRootElement';

export default function Navigation(props) {
	return (
		<div className='navigation'>
			<NavigationRootElement
				name='Albums'
				albumData={props.albumData}
				clearImageData={props.clearImageData}
				addImageData={props.addImageData}
				setImageFilterText={props.setImageFilterText}
				setIsNavDisplayed={props.setIsNavDisplayed}
				isDesktopScreen={props.isDesktopScreen}
			/>
			<a href='' className="navigation__link">Links</a>
			<a href='' className="navigation__link">About</a>
		</div>
	)
}