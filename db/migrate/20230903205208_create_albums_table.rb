class CreateAlbumsTable < ActiveRecord::Migration[6.1]
    def change
      create_table :albums do |t|
        t.string :name, null: false
        t.references :album, foreign_key: true
        
        t.timestamps
      end
    end
  end