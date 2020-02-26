from flask import Flask, request, make_response
import os.path
import sh
import re
import markdown
import json
from bs4 import BeautifulSoup


app = Flask(__name__)

git = sh.git.bake(_cwd=os.path.realpath('docstore'))

@app.route('/update/<unsafe_page>', methods=['GET', 'OPTIONS'])
def blah(unsafe_page):
    return "blah"

def nameslug(name):
    slugged = re.sub(r'[^a-zA-Z0-9_\.]', '', name)
    slugged = re.sub(r'\.{2,}', '.', slugged)
    slugged = re.sub(r'^\.', '', slugged)
    return slugged

def safename(unsafe_page):
    # slugged = slugify.slugify(unsafe_page)
    slugged = nameslug(unsafe_page)
    path =  os.path.realpath('./docstore/' + slugged)

    print path
    return slugged, path

def link_data(rawdata):
    rendered = markdown.markdown(rawdata)
    souped = BeautifulSoup(rendered)
    links = souped.find_all('a')

    def extract_link(link):
        return {"text": link.text.strip(), "href": nameslug(link["href"]) }
    link_data = map(extract_link, links)
    return link_data

@app.route('/links/<unsafe_page>', methods=['GET'])
def links(unsafe_page):
    slug, path = safename(unsafe_page)
    with open(path, 'r') as file:
        data = file.read()
        links = link_data(data)
        payload = {
            "links": links
        }
        return json.dumps(payload)

@app.route('/update/<unsafe_page>', methods=['POST'])
def update(unsafe_page):
    slug, path = safename(unsafe_page)

    if not os.path.isfile(path):
        print "creating file"
        # return make_response('failed', 401)

    print request.form
    data = request.form['data']
    commit_message = request.form['change_notes']

    with open(path, 'w') as file:
        file.write(data)

    log = str(git.add(slug))
    log += str(git.commit(message=commit_message))

    links = link_data(data)

    payload = {
        "links": links,
        "log": log
    }
    
    return json.dumps(payload)

app.run(host='127.0.0.1', port=7471, debug=True)

