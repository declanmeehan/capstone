class CreateSynths < ActiveRecord::Migration[5.1]
  def change
    create_table :synths do |t|
      t.string :name
      t.string :filename

      t.timestamps
    end
  end
end
