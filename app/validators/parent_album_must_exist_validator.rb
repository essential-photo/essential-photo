class ParentAlbumMustExistValidator < ActiveModel::Validator
    def validate(record)
        if record.parent_album_id
            if !record.parent_album_id.nil? && Album.find_by_id(record.parent_album_id).nil?
                record.errors.add(:parent_album_id, "must exist")
            end
        end
    end
end