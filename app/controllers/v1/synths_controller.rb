class V1::SynthsController < ApplicationController
  def index 
    synth = Synth.all
    render json: synth.as_json
  end
  def create
    synth = Synth.new(
      name: params[:name],
      filename: params[:filename]
      )
    if synth.save
    render json: synth.as_json
    else 
      render json: {errors: order.errors.full_messages}, status: :bad_request
    end
  end

  
  
end
