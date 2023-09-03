class AlbumIdValidator < ActiveModel::Validator
    def validate(record)
        if record.album_id
            if Album.find_by_id(record.album_id).nil?
                record.errors.add(:album_id, "foreign key must exist")
            end
        end
    end
end