from flask import Flask

app = Flask(__name__, static_folder='../../static')

app.run(debug=True)

from . import views