class ImagesRenameAlbumIdColumnToParentAlbumId < ActiveRecord::Migration[6.1]
    def change
        rename_column(:images, :album_id, :parent_album_id)
    end
end