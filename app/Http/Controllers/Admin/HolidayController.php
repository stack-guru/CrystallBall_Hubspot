<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\HolidayRequest;
use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $data['holidays']=Holiday::orderBy('created_at','DESC')->get();
        return view('admin/data-source/holiday/index',$data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        return view('admin/data-source/holiday/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(HolidayRequest $request)
    {
        //
        $holiday =new Holiday;
        $holiday->fill($request->validated());
        $holiday->save();
        return redirect()->route('admin.data-source.index')->with('msg','holiday saved successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $data['holiday']=Holiday::find($id);
        return view('admin.data-source.holiday.update',$data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(HolidayRequest $request, $id)
    {
        //
        //
        $holiday =Holiday::find($id);
        $holiday->fill($request->validated());
        $holiday->save();
        return redirect()->route('admin.data-source.index')->with('msg','holiday updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $holiday =Holiday::find($id);
         $holiday->delete();
        return redirect()->route('admin.data-source.index')->with('msg','holiday deleted successfully');

    }
}
