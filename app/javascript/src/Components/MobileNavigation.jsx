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
			<MobileNavigationElement
				id={null}
				getChildAlbums={getChildAlbums}
				getAlbumName={getAlbumName}
				getAlbumDepth={getAlbumDepth}
			/>
		</div>
	)
}