class SynthTag < ApplicationRecord
 belongs_to :synt
 belongs_to :tag, optional: true

  def self.dedupe
   grouped = all.group_by{|thru| [thru.tag_id, thru.synth_id] }
    grouped.values.each do |duplicates|
      # the first one we want to keep right?
      first_one = duplicates.shift 
      # or pop for last one`
      # if there are any more left, they are duplicates
      # so delete all of them
      duplicates.each{|double| double.destroy} # duplicates can now be destroyed
    end
  end



end   


SynthTag.dedupe