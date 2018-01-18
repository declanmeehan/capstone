class Tag < ApplicationRecord
  has_many :synth_tags
  has_many :synths, through: :synth_tags
end
