class Synth < ApplicationRecord

  belongs_to :user
  has_many :likes
  has_many :users, through: :likes
  has_many :synth_tags
  has_many :tags, through: :synth_tags


end
