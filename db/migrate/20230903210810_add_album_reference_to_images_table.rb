class AddAlbumReferenceToImagesTable < ActiveRecord::Migration[6.1]
    def change
      add_reference :images, :album, foreign_key: true
    end
  end