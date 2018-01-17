Rails.application.routes.draw do

  post 'user_token' => 'user_token#create'



  namespace :v1 do
    
  get "/synths" => "synths#index"
  post "/synths" => "synths#create"
  get "/synths/user/:user_id" => "synths#userProfilePublic"
  get "/synths/private" => "synths#userProfilePrivate"
  get "/synths/:id" => "synths#show"
  patch "synths/:id" => "synths#update"

  end
  namespace :v1 do 
    get "/tags" => "tags#index"
    post "/tags" => "tags#create"
    
  end

  namespace :v1  do
   get "/users" => "users#index"
   post "/users" => "users#create"
   get "/users/:id" => "users#show"
  end




end
