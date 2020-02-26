require 'rubygems'
require 'sourceclassifier'

s = SourceClassifier.new

must = s.identify(open("mustache.html").read)
smallruby = s.identify(open("smallruby.rb").read)
puts must
puts smallruby
# s.identify(c_text) #=> Gcc
