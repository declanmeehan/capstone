class Synth < ApplicationRecord
  validates :name, presence: true
  validates :filename, presence: true

  belongs_to :user
  has_many :likes
  has_many :tags, through: :synth_tag
  has_many :users, through: :likes

end
