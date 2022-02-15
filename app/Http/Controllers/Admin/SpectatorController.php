<?php

namespace App\Http\Controllers\Admin;

use App\Models\Spectator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\SpectatorRequest;

class SpectatorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin/spectator/index')->with('spectators', Spectator::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin/spectator/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SpectatorRequest $request)
    {
        $spectator = new Spectator;
        $spectator->fill($request->validated());
        $spectator->save();

        return redirect()->route('admin.spectator.index')->with('success', true);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Spectator  $spectator
     * @return \Illuminate\Http\Response
     */
    public function edit(Spectator $spectator)
    {
        return view('admin/spectator/edit')->with('spectator', $spectator);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Spectator  $spectator
     * @return \Illuminate\Http\Response
     */
    public function update(SpectatorRequest $request, Spectator $spectator)
    {
        $spectator->fill($request->validated());
        if ($request->has('password') && !empty($request->password)) {
            $this->validate($request, [
                'password' => ['confirmed', 'nullable', 'string', 'min:8'],
            ]);
            $spectator->password = bcrypt($request->password);
        }
        $spectator->save();

        return redirect()->route('admin.spectator.index')->with('success', true);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Spectator  $spectator
     * @return \Illuminate\Http\Response
     */
    public function destroy(Spectator $spectator)
    {
        $spectator->delete();

        return redirect()->route('admin.spectator.index')->with('success', true);
    }
}
