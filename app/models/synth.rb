class Synth < ApplicationRecord
  cattr_accessor :current_user
  belongs_to :user
  has_many :likes
  has_many :users, through: :likes
  has_many :synth_tags
  has_many :tags, through: :synth_tags

  has_attached_file :audioFile
    
  validates_attachment :audioFile,
    content_type: {
      content_type: [/.*/]
    }


end
