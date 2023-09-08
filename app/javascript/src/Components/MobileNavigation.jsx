import React from 'react';
import './MobileNavigation.css';
import MobileNavigationElement from './MobileNavigationElement';

export default function MobileNavigation(props) {
	function getChildAlbums(albumId) {
		return props.albumData.filter(album => album.parent_album_id === albumId);
	}

	function getAlbumName(albumId) {
		if (albumId) {
			return props.albumData.filter(album => album.id === albumId)[0].name
		}
		else {
			return 'Albums'
		}
	}

	function getAlbumDepth(albumId, depth = 0) {
		const album = props.albumData.filter(album => album.id === albumId)[0];

		if (album) {
			return getAlbumDepth(album.parent_album_id, depth + 1);
		}
		else {
			return depth;
		}
	}

	return (
		<div className='mobileNavigation'>
			<div className="mobileNavigation__elementContainer">
				<MobileNavigationElement
					id={null}
					getChildAlbums={getChildAlbums}
					getAlbumName={getAlbumName}
					getAlbumDepth={getAlbumDepth}
					clearImageData={props.clearImageData}
					setImageFetchParameters={props.setImageFetchParameters}
					setImageFilterText={props.setImageFilterText}
					setIsNavDisplayed={props.setIsNavDisplayed}
				/>
			</div>
			<a href='' className="mobileNavigation__link">Links</a>
			<a href='' className="mobileNavigation__link">About</a>
		</div>
	)
}