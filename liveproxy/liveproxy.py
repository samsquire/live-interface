from twisted.web import proxy, http
from twisted.internet import reactor
from twisted.python import log
import sys
import pprint
import subprocess
# log.startLogging(sys.stdout)

class ProxyClient(proxy.ProxyClient):
    def handleResponseEnd(self):
        contentTypes = self.father.responseHeaders.getRawHeaders("Content-Type")
        print contentTypes
        if contentTypes and any(["text/html" in type for type in contentTypes]):
            pprint.pprint(self.father.uri)
            proc = subprocess.Popen(
                ['phantomjs', './screencapture.js', self.father.uri])
            print proc

class ProxyClientFactory(proxy.ProxyClientFactory):
    protocol = ProxyClient

class ProxyRequest(proxy.ProxyRequest):
    protocols = dict(http=ProxyClientFactory)

class InterceptingProxy(proxy.Proxy):
    requestFactory = ProxyRequest

    def __init__(self):
        proxy.Proxy.__init__(self)

    def allContentReceived(self):
        http.HTTPChannel.allContentReceived(self)
        request = self.requests[-1]
        pprint.pprint(request)


class ProxyFactory(http.HTTPFactory):
    protocol = InterceptingProxy


reactor.listenTCP(1234, ProxyFactory())
reactor.run()
