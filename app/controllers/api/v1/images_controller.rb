class Api::V1::ImagesController < ApplicationController
  require "image_processing/mini_magick"

  before_action :authenticate_api_v1_admin!, except: :index

  def index
    # if the admin is signed in and supplies the 'include_private=true' query 
    # parameter, return all images (public and private)
    # otherwise, return only public images
    @images = Image.where(is_public: true)

    if api_v1_admin_signed_in? && params[:include_private]
      if params[:include_private] == 'true'
        @images = Image.all
      end
    end

    # filter results based on album
    if params[:parent_album_id]
      if params[:parent_album_id] == 'null'
        @images = @images.where(parent_album_id: nil)
      else
        @images = @images.where(parent_album_id: params[:parent_album_id])
      end
    end

    # filter results based on tag
    if params[:tags]
      tags_array = params[:tags].split(",").map{|tag| tag.strip}
      @images = @images.tagged_with(tags_array)
    end

    formatted_images = @images.map{ |image| formatted_image(image) }
    render json: formatted_images, status: :ok
  end

  def create
    # build new image object
    @image = Image.new

    # by default, make image publicly available
    @image.is_public = true

    if params[:image]
      # attach the image to the image object
      @image.image.attach(params[:image])

      # create and attach a thumbnail too
      thumbnail = ImageProcessing::MiniMagick
        .source(params[:image].tempfile.path)
        .resize_to_limit(400, 400)
        .call

      filename = params[:image].original_filename
      thumbnail_filename = filename.insert(filename.index('.'), '_thumb')
      @image.thumbnail.attach(io: thumbnail, filename: thumbnail_filename)
    end

    # add image to an album
    if params[:parent_album_id] == 'null'
        @image.parent_album_id = nil
    else
        @image.parent_album_id = params[:parent_album_id]
    end
    
    if @image.save
      render json: formatted_image(@image), status: :created
    else
      render json: @image.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    @image = Image.find(params[:id])

    if params[:title] == 'null'
      @image.title = nil
    else
      @image.title = params[:title]
    end

    if params[:description] == 'null'
      @image.description = nil
    else
      @image.description = params[:description]
    end

    @image.is_public = params[:is_public]

    # expect tags to be separated by comma,
    # and strip leading/trailing whitespace
    new_tag_names = params[:tags].split(",").map{|tag| tag.strip}
    
    # delete any tags associated with the image that
    # don't appear in params
    tag_ids = @image.tags.where.not(name: new_tag_names).map{|tag| tag.id}
    tag_ids.each do |tag_id|
      ImageTag.where(image_id: @image.id, tag_id: tag_id).each{|image_tag| image_tag.destroy}
    end

    # attach new tags to image
    new_tag_names.each do |new_tag_name|
      existing_tag = Tag.find_by_name(new_tag_name)

      # if there is already an existing tag that matches the new tag name
      # and the image doesn't already have that tag, attach it to the image
      # otherwise, create a new tag
      if existing_tag 
        if !@image.tags.include?(existing_tag)
          @image.tags << existing_tag
        end
      else 
        @image.tags.create(name: new_tag_name)
      end
    end

    # add image to an album
    if params[:parent_album_id] == 'null'
        @image.parent_album_id = nil
    else
        @image.parent_album_id = params[:parent_album_id]
    end

    if @image.save
      render json: formatted_image(@image), status: :ok
    else
      render json: @image.errors.full_messages, status: :unprocessable_entity
    end
  end

  private

  def formatted_image(image)
    return {
      id: image.id,
      title: image.title,
      description: image.description,
      tags: image.tags,
      is_public: image.is_public,
      parent_album_id: image.parent_album_id,
      image_url: url_for(image.image),
      thumbnail_url: url_for(image.thumbnail),
      created_at: image.created_at,
      updated_at: image.updated_at,
    }
  end
end