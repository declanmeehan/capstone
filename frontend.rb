require 'unirest'
require 'tty-table'
require 'tty-prompt'
require 'pp'

   #  response = Unirest.post("http://localhost:3000/v1/user_token", parameters: {auth: {email: "fake@email.com", password: "password"}}
   #    )
   # response.body
   #   jwt = response.body["jwt"]
   #   Unirest.default_header("Authorization", "Bearer #{jwt}")

while true
  system "clear"
  # if jwt == ""
  #     login_status = "You are currently logged out"
  # else 
  #     login_status = "you are currently logged in"
  # end
  # puts login_status
  # puts
  params = {}

  puts "Please enter a number:"
  puts "test"
  puts "[1] show all synths"
  # puts "[1.1] search products by name" 
  # puts "[1.2] search products by price" 
  puts "[2] create a synth"
  puts "[2.1] create an order"
  puts "[3] show a product"
  puts "[4] update a product"
  puts "[5] delete a product"
  puts "[6] show all current user orders"
  puts "[signup] sign up as a new user"
  puts "[login] login"
  puts "[logout] logout"
  puts "[q] Quit"
  answer_crud = gets.chomp

  if answer_crud == "1"
    response = Unirest.get("http://localhost:3000/v1/synths")
    body = response.body
    pp body
  # elsif answer_crud == "1.1"
  #   print "enter product name: "
  #   search_name = gets.chomp
  #   response = Unirest.get("http://localhost:3000/v1/products?search=#{search_name}")
  #   product = response.body
  #   pp product
  # elsif answer_crud == "1.2"
  #   print "enter product price: "
  #   response_price = gets.chomp
  #   response = Unirest.get("http://localhost:3000/v1/products?search_price=#{response_price}")
  #   product = response.body
  #   pp product
  elsif answer_crud == "test"
    print current_user.id
  elsif answer_crud == "2"
    print "enter synth name: "
    params["name"] = gets.chomp
    print "Enter the path to the file:"
    input_file_path = gets.chomp
    response = Unirest.post(
    "http://localhost:3000/v1/posts", 
    headers: { "Accept" => "application/json" }, 
    parameters:{
      title: input_title, 
      body: input_body,
      image: File.new(input_file_path, 'rb')
    }
  )
    # print "enter product image: "
    # params["images"] = gets.chomp
    params["description"] = gets.chomp
    response = Unirest.post("http://localhost:3000/v1/synths", parameters: params)
    synth = response.body
    pp synth
  # elsif answer_crud == "2.1"
  #   params = {}
  #   puts "enter product_id"
  #   params[:product_id] = gets.chomp
  #   puts "enter quantity"
  #   params[:quantity] = gets.chomp
  #   response = Unirest.post("http://localhost:3000/v1/orders", parameters: params)
  #   body = response.body
  #   p body
  # elsif answer_crud == "3" 
  #   puts "please enter an id number"
  #   answer_id = gets.chomp
  #   response = Unirest.get("http://localhost:3000/v1/products/#{answer_id}")
  # elsif answer_crud == "4"
  #   params = {}
  #   print "enter a the product id that you would like to update: "
  #   answer_update = gets.chomp
  #   print "enter product name: "
  #   params["name"] = gets.chomp
  #   print "enter product price: "
  #   params["price"] = gets.chomp
  #   print "enter product image: "
  #   params["image"] = gets.chomp
  #   print "enter product Description: "
  #   params["description"] = gets.chomp
  #   response = Unirest.patch("http://localhost:3000/v1/products/#{answer_update}", parameters: params)
  #   body = response.body
  #   pp body
  # elsif answer_crud == "5"
  #   print "what product would you like to delete? "
  #   answer_delete = gets.chomp
  #   response = Unirest.delete("http://localhost:3000/v1/products/#{answer_delete}")
  # elsif answer_crud == "6"
  #    response = Unirest.get("http://localhost:3000/v1/orders")
  #    orders = response.body
  #    pp orders 
  # elsif answer_crud == "signup"
  #   params = {}
  #   puts "enter username: "
  #   params[:name] = gets.chomp
  #   puts "enter email: "
  #   params[:email] = gets.chomp
  #   puts "enter password"
  #   params[:password] = gets.chomp
  #   puts "please re-enter password"
  #   params[:password_confirmation] = gets.chomp
  #   response = Unirest.post("http://localhost:3000/v1/users", parameters: params)
  #   pp response.body
  elsif answer_crud == "login"
    puts "Login to the app"
    params = {}
    print "Email: "
    params[:email] = gets.chomp
    print "Password: "
    params[:password] = gets.chomp
    response = Unirest.post("http://localhost:3000/user_token", parameters: {auth: {email: params[:email], password: params[:password]}}
      )
    pp response.body

    jwt = response.body["jwt"]

    Unirest.default_header("Authorization", "Bearer #{jwt}")
  elsif answer_crud == "logout"
    jwt = ""
    puts "Logged out"
    Unirest.clear_default_headers()
  elsif answer_crud == "q"
    puts "Goodbye!"
    break
  else 
    puts "Please enter a valid command"
  end
  puts 
  puts "press any key to continue"
  gets.chomp
end