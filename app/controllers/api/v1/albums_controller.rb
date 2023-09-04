class Api::V1::AlbumsController < ApplicationController
    def index
        @albums = Album.all

        formatted_albums = @albums.map{|album|
            {
                id: album.id,
                name: album.name,
                parent_album_id: album.album_id
            }
        }

        render json: formatted_albums, status: :ok
    end
end