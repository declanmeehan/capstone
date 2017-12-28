class RemovefilenameFromSynths < ActiveRecord::Migration[5.1]
  def change
    remove_column :synths, :filename, :string
  end
end
