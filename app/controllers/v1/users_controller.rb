class V1::UsersController < ApplicationController
  def index
  user = User.all
  render json: user.as_json
  
  end

  def create 
    user = User.new(
      email: params[:email],
      password: params[:password],
      password_confirmation: params[:password_confirmation]
      )
    if user.save 
      render json: {status: 'User created successfully'}, status: :created
    else 
      render json: {errors: user.errors.full_messages}, status: bad_request
    end
  end



end
