class AlbumCantReferToSelfValidator < ActiveModel::Validator
    def validate(record)
        if !record.id.nil? && (record.album_id == record.id)
            record.errors.add(:album_id, "album_id must refer to another album record")
        end
    end
end