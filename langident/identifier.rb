class Classifier
  def initialize
    @data = {}
    @totals = Hash.new(1)
  end

  def words(code)
    code.split(/[^a-z]/).reject{|w| w.empty?}
  end

  def train(code,lang)
    @totals[lang] += 1
    @data[lang] ||= Hash.new(1)
    words(code).each {|w| @data[lang][w] += 1 }
  end

  def classify(code)
    ws = words(code)
   
    lang = @data.keys.max_by do |lang|
      # We really want to multiply here but I use logs 
      # to avoid floating point underflow
      # (adding logs is equivalent to multiplication)
      Math.log(@totals[lang]) +
      ws.map{|w| Math.log(@data[lang][w])}.reduce(:+)
    end
    puts @data[lang]
    lang
  end
end

# Example usage

c = Classifier.new

# Train from files
c.train(open("mustache.html").read, :mustache)
# c.train(open("code.py").read, :python)
# c.train(open("code.cs").read, :csharp)

# Test it on another file
puts c.classify(open("mustache.html").read)
