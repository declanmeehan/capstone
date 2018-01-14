class User < ApplicationRecord
  has_secure_password  

  has_many :likes
  has_many :synths

  # def as_json
  #   {
  #     id: id,
  #     synths: synths
  #   }
  # end

end
