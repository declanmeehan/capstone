User.create({"email" => "fake@gmail.com", "password" => "password"})
User.create({"email" => "test@gmail.com", "password" => "password"})
Tag.create({"name" => "traffic"})
Tag.create({"name" => "8-bit"})
Tag.create({"name" => "filteredDrums"})
Tag.create({"name" => "outdoors"})
Synth.create({"name" => "acidic", "audioFile" => "/audioClips/Clap 1.wav", "user_id" => 1 })
Synth.create({"name" => "keymaker", "audioFile" => "/audioClips/Clap 2.wav", "user_id" => 2 })
Synth.create({"name" => "paulverizer", "audioFile" => "/audioClips/Clap+Snare.wav", "user_id" => 1 })
SynthTag.create({"synth_id" => 1, "tag_id" => 1})
SynthTag.create({"synth_id" => 1, "tag_id" => 2})
SynthTag.create({"synth_id" => 2, "tag_id" => 2})
SynthTag.create({"synth_id" => 2, "tag_id" => 3})
Like.create({"synth_id" => 1, "user_id" => 1})
Like.create({"synth_id" => 1, "user_id" => 2})
Like.create({"synth_id" => 2, "user_id" => 1})





# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
