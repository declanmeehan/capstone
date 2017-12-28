Rails.application.routes.draw do

  post 'user_token' => 'user_token#create'



  namespace :v1 do
  get "/synths" => "synths#index"
  post "/synths" => "synths#create"

  end
  namespace :v1 do 
    get "/tags" => "tags#index"
    post "/tags" => "tags#create"
  end

  namespace :v1  do
   get "/users" => "users#index"
   post "/users" => "users#create"
  end




end
