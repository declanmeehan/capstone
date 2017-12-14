User.create({"email" => "fake@gmail.com", "password" => "password"})
User.create({"email" => "test@gmail.com", "password" => "password"})
Tag.create({"name" => "heavy"})
Tag.create({"name" => "sine"})
Tag.create({"name" => "arpeggiator"})
Synth.create({"name" => "acidic", "filename" => "blah.wav"})
Synth.create({"name" => "keymaker", "filename" => "blahs.wav"})
Synth.create({"name" => "paulverizer", "filename" => "bloo.wav"})






# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
