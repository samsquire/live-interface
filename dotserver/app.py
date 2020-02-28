from flask import Flask, request, Response
import json
import subprocess
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/rd",methods=["POST"])
def recursivediagram():
    diagram = json.loads(request.data)

    proc = subprocess.Popen(
                ['dot', '-Tsvg'],
                stdout=subprocess.PIPE,
                stdin=subprocess.PIPE)
    proc.stdin.write("digraph G {")
    seen = {}
    for thing in diagram:
        if thing['question'] not in seen:
            proc.stdin.write("{question}[label={question}];\n".format(**thing))
            seen[thing['question']] = thing
        for answers in thing["answers"]:
            proc.stdin.write("{source} -> {to};\n".format(source=thing["question"], to=answers))
    proc.stdin.write("}")
    proc.stdin.close()

    def generate():
        yield proc.stdout.read()
        proc.wait()
    return Response(generate(), mimetype="image/svg")

if __name__ == '__main__':
   app.run(port=4442, debug=True) 
