class Album < ActiveRecord::Base
    has_many :images, dependent: :destroy
    has_many :albums, dependent: :destroy
    belongs_to :album, optional: true
end
    