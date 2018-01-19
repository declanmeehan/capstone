class Tag < ApplicationRecord
  has_many :synth_tags
  has_many :synths, through: :synth_tags


  def as_json
    # synths_without_tag = synths.map do |synth| 
    #   {
    #     id: synth.id,
    #     url: synth.url,
    #     name: synth.name
    #   }
    # end
    {
      id: id,
      name: name,
      synths: synths.as_json
    }
  end
end
