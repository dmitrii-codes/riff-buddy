from flask import request, jsonify
from riff_buddy import app
from riff_buddy.buddy_model import generate
from riff_buddy.magenta_model import generate as generate_v2
from base64 import encodebytes

@app.route('/generate', methods=['POST'])
def generate_melodies():
    files = request.files
    model_type = request.form['model']
    primer_midi = files.get('midi')
    response = list()
    if model_type == 'riffBuddy':
        result_bytes = generate(primer_midi)
    elif model_type == 'magenta':
        result_bytes = generate_v2(primer_midi)
    else:
        return 'No model type provided', 400
    for result in result_bytes:
        response.append(encodebytes(result.getvalue()).decode('ascii'))
    return jsonify(response)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file('index.html')