class Api::V1::AlbumsController < ApplicationController
    #before_action :authenticate_api_v1_admin!, except: :index

    def index
        @albums = Album.all

        formatted_albums = @albums.map{|album| formatted_album(album)}

        render json: formatted_albums, status: :ok
    end

    def create
        @album = Album.new
        @album.name = params[:name]

        if params[:parent_album_id] == 'null'
            @album.parent_album_id = nil
        else
            @album.parent_album_id = params[:parent_album_id]
        end

        if @album.save
            render json: formatted_album(@album), status: :created
        else
            render json: @album.errors.full_messages, status: :unprocessable_entity
        end
    end

    def update
        if Album.exists?(params[:id])
            @album = Album.find(params[:id])
            @album.name = params[:name]
    
            if params[:parent_album_id] == 'null'
                @album.parent_album_id = nil
            else
                @album.parent_album_id = params[:parent_album_id]
            end

            if @album.update
                render json: formatted_album(@album), status: :ok
            else
                render json: @album.errors.full_messages, status: :unprocessable_entity
            end
        else
            render json:  {message: "Album not found"}, status: :unprocessable_entity
        end
    end

    def destroy
        if Album.exists?(params[:id])
            @album = Album.find(params[:id])
            @album.destroy
            render json:  {message: "Album id: #{params[:id]} Deleted Successfully"}, status: :ok
        else
            render json:  {message: "Album not found"}, status: :unprocessable_entity
        end
    end

    private

    def formatted_album(album)
        return {
            id: album.id,
            name: album.name,
            parent_album_id: album.parent_album_id
        }
    end
end