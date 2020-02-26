service {'homebrew.mxcl.couchdb':
  provider => 'launchd',
  ensure   => 'running'
}

service { 'lib':
  provider => 'base',
  ensure   => 'running',
  binary   => 'http-server -p 8000'
}

service { 'livesystem':
  provider => 'base',
  ensure   => 'running',
  binary   => 'http-server -p 7003'
}

service { 'shellbucket':
  provider => 'base',
  ensure   => 'running',
  binary   => 'node shellbucket.js'
}

service { 'langident':
  provider => 'base',
  ensure   => 'running',
  binary   => 'ruby langident/langserver.rb'
}
