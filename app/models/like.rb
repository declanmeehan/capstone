class Like < ApplicationRecord
  belongs_to :synth, optional: true
  belongs_to :user, optional: true
  




end
