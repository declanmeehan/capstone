class V1::UsersController < ApplicationController
  def index
  user = User.all
  render json: user.as_json
  end
end
