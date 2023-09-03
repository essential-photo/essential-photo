class Image < ApplicationRecord
  has_one_attached :image
  has_one_attached :thumbnail
  has_many :image_tags, dependent: :destroy
  has_many :tags, through: :image_tags
  belongs_to :album, optional: true

  validates :image, attached: true, content_type: [:png, :jpg, :jpeg]
  validates :is_public, inclusion: [true, false]

  validates_with AlbumIdValidator

  # return images that have all supplied tags
  scope :tagged_with, ->(tags) do
    select('*')
    .where(id: 
      select(:id)
      .joins(:tags)
      .where(tags: {name: tags})
      .group(:id)
      .having("COUNT(*) = ?", tags.length)
      .pluck(:id)
    )
  end
end