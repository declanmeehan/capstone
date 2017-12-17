class Synth < ApplicationRecord

  belongs_to :user
  has_many :likes
  has_many :tags, through: :synth_tags
  has_many :users, through: :likes

end
