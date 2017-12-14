class User < ApplicationRecord
  validates :name, presence: true

  has_many :likes
  has_many :synths



end
