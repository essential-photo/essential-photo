class Album < ActiveRecord::Base
    has_many :images, foreign_key: :parent_album_id, dependent: :destroy
    has_many :albums, foreign_key: :parent_album_id, dependent: :destroy
    belongs_to :album, foreign_key: :parent_album_id, optional: true

    validates :name, presence: true

    validates_with ParentAlbumCantBeSelfValidator
    validates_with ParentAlbumMustExistValidator
end
    