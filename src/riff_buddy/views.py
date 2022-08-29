from riff_buddy import app

@app.route('/generate', methods=['GET'])
def generate():
    return 'generated', 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file('index.html')