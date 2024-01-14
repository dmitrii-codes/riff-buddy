import os
import glob
from io import BytesIO
from uuid import uuid4
from riff_buddy import app
from magenta.models.melody_rnn import melody_rnn_generate
from werkzeug.utils import secure_filename
import pretty_midi

def save_incoming_file(file):
	filename = secure_filename(file.filename)
	filepath = os.path.join(app.root_path, "uploaded", filename)
	file.save(filepath)
	return filepath

def generate(midi, num_outputs=4):
	primer_midi	= save_incoming_file(midi)
	generate_script_path = melody_rnn_generate.__file__
	config = 'attention_rnn'
	run_dir = os.path.join(app.root_path, 'checkpoints')
	output_dir = os.path.join(app.root_path, 'generated', uuid4().hex)
	hparams = 'batch_size=128,rnn_layer_sizes=[256,256]'

	os.system('python %s --config=%s --run_dir=%s --output_dir=%s --num_outputs=%d --num_steps=512 --hparams=%s --primer_midi=%s' % (
		generate_script_path, config, run_dir, output_dir, num_outputs, hparams, primer_midi
	))

	results = list()
	# for each file in output dir, assign an instrument and return buffers
	list_of_files = glob.glob(output_dir + '/*.mid')
	for midi_file in list_of_files:
		buffer = add_distortion(midi_file)
		results.append(buffer)

	return results

def add_distortion(midi_file):
	instrument_name = 'Distortion Guitar'
	pm = pretty_midi.PrettyMIDI(midi_file)

	all_notes = []
	for instrument in pm.instruments:
		all_notes += instrument.notes

	sorted_notes = sorted(all_notes, key=lambda note: note.start)
	instrument = pretty_midi.Instrument(program=pretty_midi.instrument_name_to_program(instrument_name))

	for note in sorted_notes:
		instrument.notes.append(note)

	new_pm = pretty_midi.PrettyMIDI()
	new_pm.instruments.append(instrument)
	file_bytes = BytesIO()
	new_pm.write(file_bytes)
	return file_bytes