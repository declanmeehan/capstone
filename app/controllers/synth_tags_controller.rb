class SynthTagsController < ApplicationController

   def index 
    synth_tag = SynthTag.all
    render json: synth_tag.as_json
   end
    def create
      synth_tag = SynthTag.new(
        synth_id: params[:synth_id],
        tag_id: params[:tag_id],
        )
      if synth_tag.save
      render json: synth_tag.as_json
      else 
        render json: {errors: synth_tag.errors.full_messages}, status: :bad_request
      end
    end

    def destroy
      synthid = SynthTag.where(synth_id: params[:synth_id])

      synthTag.destroy
    end

end
