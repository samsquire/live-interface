import detect



class Resource(object):
    def __init__(self):
        self.name = ""

class Grid(object):

    def __init__(self, folder):
        self.folder = folder
        self.resources = []

    def spider(self):

        # we create a default resource for
        # the directory itself
        self.resources.push(Resource({
            "name": "index",
            "path": self.folder
        }))

        # the grid is like an index of the files on the file system
        # and their relationships (hyperlinks)
        # where to find everything and how to intitialise
        # the non-static parts of a living document
        # such as the microservices and REPLs
        for item in self.resources:
            # an item probes its exitence - it may no longer exist on the file system 
            item.probe()

        for file in self.folder:
            # detect the general kind of file and add it to the resources
            resource = detect(file)
            self.resources.append(resource)


    def get(self, name):
        resource = self.resources.find(name)
        # the resource becomes a tree once parsed
        # its components are now separately addressable
        resource.parse()

def load():
    # load the file system representation of the local grid
    grid = Grid(".")
    # it may be out of date, so lets respider
    grid.spider()
    grid.watch()
