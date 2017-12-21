class AddUserIdToSynths < ActiveRecord::Migration[5.1]
  def change
    add_column :synths, :user_id, :integer
  end
end
