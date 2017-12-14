Rails.application.routes.draw do
  namespace :v1 do
  get "/synths" => "synths#index"
  post "/synths" => "synths#create"

  end
  namespace :v1 do 
    get "/tags" => "tags#index"
  end

  namespace :v1  do
   get "/users" => "users#index"
  end




end
