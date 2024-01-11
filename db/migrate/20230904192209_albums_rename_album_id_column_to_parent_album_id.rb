class AlbumsRenameAlbumIdColumnToParentAlbumId < ActiveRecord::Migration[6.1]
    def change
        rename_column(:albums, :album_id, :parent_album_id)
    end
end