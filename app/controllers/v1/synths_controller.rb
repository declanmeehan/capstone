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
    synth.save
    render json: synth.as_json
  end

end
