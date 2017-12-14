class V1::TagsController < ApplicationController
  def index 
    tag = Tag.all
    render json: tag.as_json
  end

end
