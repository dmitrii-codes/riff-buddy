import os
import tensorflow as tf
import numpy as np
import pandas as pd
import pretty_midi
import collections
import io
from riff_buddy import app

# encourage positive steps
def mse_with_positive_pressure(y_true, y_pred):
    mse = (y_true - y_pred) ** 2
    positive_pressure = 10 * tf.maximum(-y_pred, 0.0)
    return tf.reduce_mean(mse + positive_pressure)

# encourage longer steps and non-negative values
def mse_with_positive_step_pressure(y_true, y_pred):
    mse = (y_true - y_pred) ** 2
    longer_positive_step_pressure = 10 * tf.maximum(0.05 - y_pred, 0.0)
    return tf.reduce_mean(mse + longer_positive_step_pressure)


def midi_to_notes(midi_file):
    instrument_notes = []

    pm = pretty_midi.PrettyMIDI(midi_file)
    # Some guitar tracks use multiple midi instruments (i.e. clean/overdrive)
    for instrument in pm.instruments:
        instrument_notes += instrument.notes

    # Sort the notes by start time
    sorted_notes = sorted(instrument_notes, key=lambda note: note.start)
    prev_start = sorted_notes[0].start

    # Process features
    processed_notes = collections.defaultdict(list)
    for note in sorted_notes:
        processed_notes['pitch'].append(note.pitch)
        processed_notes['start'].append(note.start)
        processed_notes['end'].append(note.end)
        processed_notes['step'].append(note.start - prev_start)
        processed_notes['duration'].append(note.end - note.start)
        prev_start = note.start

    return pd.DataFrame({
        name: np.array(value) for name, value in processed_notes.items()
    })


def notes_to_midi(notes, instrument_name, velocity=100):
    instrument = pretty_midi.Instrument(
        program=pretty_midi.instrument_name_to_program(instrument_name))

    prev_start = 0
    for _, note in notes.iterrows():
        start = float(prev_start + note['step'])
        end = float(start + note['duration'])
        note = pretty_midi.Note(
            velocity=velocity,
            pitch=int(note['pitch']),
            start=start,
            end=end,
        )
        instrument.notes.append(note)
        prev_start = start

    pm = pretty_midi.PrettyMIDI()
    pm.instruments.append(instrument)
    file_bytes = io.BytesIO()
    pm.write(file_bytes)
    return file_bytes


def predict_next_note(notes, model, temperature=1.0):
    assert temperature > 0

    # Add batch dimension
    inputs = tf.expand_dims(notes, 0)

    predictions = model.predict(inputs)
    pitch_logits = predictions['pitch']
    step = predictions['step']
    duration = predictions['duration']

    pitch_logits /= temperature
    pitch = tf.random.categorical(pitch_logits, num_samples=1)

    pitch = tf.squeeze(pitch, axis=-1)
    duration = tf.squeeze(duration, axis=-1)
    step = tf.squeeze(step, axis=-1)

    # `step` and `duration` values should be non-negative
    step = tf.maximum(0, step)
    duration = tf.maximum(0, duration)

    return int(pitch), float(step), float(duration)


network = tf.keras.models.load_model(
    os.path.join(app.root_path, 'checkpoints/buddy.h5'),
    custom_objects={
        'mse_with_positive_step_pressure': mse_with_positive_step_pressure,
        'mse_with_positive_pressure': mse_with_positive_pressure
    })

def generate(primer_midi, melodies_generate=4):
    # set parameters
    temperature = 1
    sequence_length = 100
    num_predictions = 200
    instrument_name = 'Distortion Guitar'
    key_order = ['pitch', 'step', 'duration']

    primer_notes = midi_to_notes(primer_midi)
    sample_notes = np.stack([primer_notes[key] for key in key_order], axis=1)
    # pitch is normalized similar to training sequences
    input_notes = (sample_notes[:sequence_length] / np.array([128, 1, 1]))

    results = list()
    for _ in range(0, melodies_generate):
        generated_notes = list()
        prev_start = 0
        for _ in range(num_predictions):
            pitch, step, duration = predict_next_note(
                input_notes, network, temperature)
            start = prev_start + step
            end = start + duration
            input_note = (pitch, step, duration)
            generated_notes.append((*input_note, start, end))
            input_notes = np.delete(input_notes, 0, axis=0)
            input_notes = np.append(
                input_notes, np.expand_dims(input_note, 0), axis=0)
            prev_start = start
        generated_notes = pd.DataFrame(generated_notes, columns=(*key_order, 'start', 'end'))
        # append to results files
        file_bytes = notes_to_midi(pd.concat([primer_notes, generated_notes]), instrument_name=instrument_name)
        results.append(file_bytes)

    return results
