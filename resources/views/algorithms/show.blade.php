@extends('layouts.app')

@section('content')
  <div class="container">
    <h1>Algorithms</h1>

    @include('shared.messages')
    @if ($algorithms)
      <form method="POST" action="{{ route('algorithms.update', $algorithms->id) }}">
          @csrf
          @method('PATCH')

          <label for="title">{{ __('Title') }}</label>
          <input id="title" type="text" class="form-control{{ $errors->has('title') ? ' is-invalid' : '' }}" name="title" value="{{ $algorithms->title }}">

          <textarea name="algorithms" rows="30" id="algorithms" class="algorithms-content">{{ $algorithms->algorithms }}</textarea>
          <div id="errors" class="algorithms-error">
          </div>
          @if ($errors->has('title'))
              <span class="invalid-feedback">
                  <strong>{{ $errors->first('title') }}</strong>
              </span>
          @endif

          <button type="submit" class="button" id="save-button">
              {{ __('Save') }}
          </button>
      </form>

      <form method="POST" action="{{ route('algorithms.destroy', $algorithms->id) }}">
        @csrf
        @method('DELETE')
        <button  class="button button-outline">
            {{ __('Delete') }}
        </button>
      </form>
    @endif
  </div>
  <script src="https://unpkg.com/js-yaml@3.11.0/dist/js-yaml.min.js"></script>
  <script>
    var textarea = document.getElementById('algorithms')
    var errors = document.getElementById('errors')
    var saveButton = document.getElementById('save-button')

    textarea.addEventListener('keyup', function() {
      try {
        jsyaml.load(textarea.value)
        errors.innerHTML = ''
        saveButton.disabled = false
        errors.classList.remove('visible')
      } catch (error) {
        errors.innerHTML = error.message
        saveButton.disabled = true
        errors.classList.add('visible')
      }

    })


  </script>
@endsection
