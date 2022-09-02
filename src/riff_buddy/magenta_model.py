import os
import glob
from io import BytesIO
from uuid import uuid4
from riff_buddy import app
from magenta.models.melody_rnn import melody_rnn_generate
from werkzeug.utils import secure_filename

def save_incoming_file(file):
	filename = secure_filename(file.filename)
	filepath = os.path.join(app.root_path, "uploaded", filename)
	file.save(filepath)
	return filepath

def generate(midi, num_outputs=4):
	filepath = save_incoming_file(midi)

	generate_script_path = melody_rnn_generate.__file__
	config = 'mono_rnn'
	run_dir = os.path.join(app.root_path, 'checkpoints')
	output_dir = os.path.join(app.root_path, 'generated', uuid4().hex)
	hparams = 'batch_size=128,rnn_layer_sizes=[128,128]'
	primer_midi = filepath

	os.system('python %s --config=%s --run_dir=%s --output_dir=%s --num_outputs=%d --num_steps=512 --hparams=%s --primer_midi=%s' % (
		generate_script_path, config, run_dir, output_dir, num_outputs, hparams, primer_midi
	))

	results = list()
	# for each file in output dir
	list_of_files = glob.glob(output_dir + '/*.mid')
	for filepath in list_of_files:
		with open(filepath, "rb") as file:
			buffer = BytesIO(file.read())
			results.append(buffer)

	return results