<?php

namespace App\Http\Controllers;

use App\Algorithms;
use Illuminate\Http\Request;

class AlgorithmsController extends Controller
{
  public function index(Request $request)
  {
      $algorithms = Algorithms::all();

      return view('algorithms.index')->with('algorithms', $algorithms);
  }

  public function new(Request $request)
  {
      return view('algorithms.new');
  }

  public function show(Request $request)
  {
      $algorithms = Algorithms::find($request->id);

      return view('algorithms.show')->with('algorithms', $algorithms);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
      $algorithms = new Algorithms;

      $algorithms->title = $request->title;
      $algorithms->algorithms = $request->algorithms;

      $algorithms->save();

      return redirect()
          ->back()
          ->with('success', "Algorithms created");
  }

  public function update(Request $request, $id)
  {
      $algorithms = Algorithms::find($id);

      $algorithms->title = $request->title;
      $algorithms->algorithms = $request->algorithms;

      $algorithms->save();

      return redirect()
          ->back()
          ->with('success', "Algorithms updated");
  }

  public function destroy(Request $request, $id)
  {
      $algorithms = Algorithms::find($id);

      $algorithms->delete();

      return redirect()
          ->route('algorithms.index')
          ->with('success', "Algorithms deleted");
  }
}
