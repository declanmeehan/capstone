class AddTagIdToSynthTag < ActiveRecord::Migration[5.1]
  def change
    add_column :synth_tags, :synth_tag, :integer
  end
end
