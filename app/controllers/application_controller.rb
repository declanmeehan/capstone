class ApplicationController < ActionController::API
  include Knock::Authenticable

  def authorize
    redirect_to '/login' unless current_user
  end

end
