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

  def as_json
    {
      id: id,
      name: name,
      user_id: user_id,
      url: audioFile,
      tags: tags.map { |tag| {id: tag.id, name: tag.name }}
      # tags: tags.as_json
    }
  end
end
