import io
import time
from flask import Flask, Response, request, stream_with_context

app = Flask(__name__)

@app.route('/doubles', methods=['POST'])
def double():
    def process_lines():
        for line in request.stream:
            number = int(line)
            yield str(number * 2) + "\n"
            time.sleep(1)
    return Response(stream_with_context(process_lines()))


app.run(port=8000, host='127.0.0.1', debug=True)

