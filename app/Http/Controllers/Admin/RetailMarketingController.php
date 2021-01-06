<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RetailMarketingRequest;
use App\Models\RetailMarketing;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RetailMarketingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $data['rms']=RetailMarketing::orderBy('created_at','DESC')->get();
        return view('admin.data-source.retail-marketing.index',$data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        return view('admin.data-source.retail-marketing.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RetailMarketingRequest $request)
    {

        $rm =new RetailMarketing;
        $rm->fill($request->validated());
        $rm->save();
        return redirect()->route('admin.data-source.index')->with('success','Retail Marketing saved successfully');
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
        $data['RetailMarketing']=RetailMarketing::find($id);
        return view('admin.data-source.retail-marketing.edit',$data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(RetailMarketingRequest $request, $id)
    {
        //
        $rm =RetailMarketing::find($id);
        $rm->fill($request->validated());
        $rm->save();
        return redirect()->route('admin.data-source.index')->with('success','Retail Marketing updated successfully');
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
        $rm =RetailMarketing::find($id);
        $rm->delete();
        return redirect()->route('admin.data-source.index')->with('success','holiday deleted successfully');
    }


    public function upload(Request $request)
    {
        $this->validate($request, [
            'csv' => 'required|file|mimetypes:text/plain|mimes:txt',
        ]);

        $filepath = $request->file('csv')->getRealPath();

        $filecontent = file($filepath);
        $headers = str_getcsv($filecontent[0]);

        if (count($headers) !== 5) {
            return redirect()->back()->with('error', 'Invalid number of columns.');
        }
        foreach ($headers as $header) {
            if (!in_array($header, [
                'category', 'event_name',
                'url', 'description', 'show_at',
            ])) {
                return redirect()->back()->with('error', 'Invalid CSV file headers.');
            }
        }

        $dateColIndex = array_search('show_at', $headers);

        $rows = $row = array();
        foreach ($filecontent as $ln => $line) {
            if (strlen($line) < (6 + 7)) {
                continue;
            }

            $row = array();
            $values = str_getcsv($line);

            if ($headers !== $values && count($values) == count($headers)) {
                try{
                    $date = Carbon::createFromFormat('Y-m-d', $values[$dateColIndex]);
                }catch (\Exception $e){
                    continue;
                    // return ['message'=>"Please upload file with '2020-12-31' date format given is $values[$i] on line $ln column $i."];
                }
                for ($i = 0; $i < count($headers); $i++) {
                    if ($headers[$i] == 'show_at') {
                        $row['show_at'] = $values[$i];
                    } else if ($headers[$i] == 'url') {
                        $row['url'] = $values[$i];
                    } else {
                        $row[trim(str_replace('"', "", $headers[$i]))] = preg_replace("/[^A-Za-z0-9-_. ]/", '', trim(str_replace('"', "", $values[$i])));
                    }
                }

                array_push($rows, $row);

            }

            if (count($rows) > 99) {
                RetailMarketing::insert($rows);
                $rows = array();
            }
        }

        if (count($rows)) {
            RetailMarketing::insert($rows);
        }

        return redirect()->back()->with('success', true);
    }






}
