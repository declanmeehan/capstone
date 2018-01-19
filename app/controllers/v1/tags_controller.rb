class V1::TagsController < ApplicationController
  def index 
    tag = Tag.all
    render json: tag.as_json
  end

  def create
    tag = Tag.new(
      name: params[:tag_name],
      )
    if tag.save
      render json: tag.as_json
    else 
      render json: {errors: tag.errors.full_messages}, status: :bad_request
    end
  end

  def show
    tag = Tag.find_by(id: params[:id])
    render json: tag.as_json
  end
end
