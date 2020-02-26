require 'sinatra'
require 'sourceclassifier'
require 'json'

s = SourceClassifier.new('/gluster/sda10/brick/mac/projects/liveinterface/langident/sourceclassifier/trainer.bin')

options '/*' do
  response["Access-Control-Allow-Headers"] = "origin, x-requested-with, content-type"
  response["Access-Control-Allow-Origin"] = "*"
end

before do
   content_type :json    
   headers 'Access-Control-Allow-Origin' => '*', 
            'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
end

set :protection, false

post '/identify' do
    body = request.body.read
    lang = s.identify(body)
    { :language => lang }.to_json
end
