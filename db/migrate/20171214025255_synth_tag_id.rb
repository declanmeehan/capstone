class SynthTagId < ActiveRecord::Migration[5.1]
  def change
    rename_column :synth_tags, :synth_tag, :tag_id
  end
end
