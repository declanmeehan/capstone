class V1::SynthsController < ApplicationController
  before_action :set_current_user

  def set_current_user
    Synth.current_user = current_user
  end

  def index 
    synth = Synth.all
    render json: synth.as_json
  end
  def create
    synth = Synth.new(
      name: params[:name],
      audioFile: params[:audioFile],
      user_id: current_user.id
      )
    if synth.save
    render json: synth.as_json
    else 
      render json: {errors: synth.errors.full_messages}, status: :bad_request
    end
  end
  def show
    synth_id = params["id"].to_i
    synth = Synth.find_by(id: synth_id)
    render json: synth.as_json
  end
  def update
    synth_id = params[id].to_i
    synth = Synth.find_by(id: synth_id)
    synth.name = params["name"]
    if product.save
      render json: synth.as_json
    else 
      render json: {errors: synth.erors.full_messages}, status: :bad_request
    end
  end



end
