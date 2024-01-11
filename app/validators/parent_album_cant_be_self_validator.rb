class ParentAlbumCantBeSelfValidator < ActiveModel::Validator
    def validate(record)
        if !record.id.nil? && (record.parent_album_id == record.id)
            record.errors.add(:parent_album_id, "must refer to another album record")
        end
    end
end