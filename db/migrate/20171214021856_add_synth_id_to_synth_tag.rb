class AddSynthIdToSynthTag < ActiveRecord::Migration[5.1]
  def change
    add_column :synth_tags, :synth_id, :integer
  end
end
