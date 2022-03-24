<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RetailMarketingRequest;
use App\Models\RetailMarketing;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        $data['rms'] = RetailMarketing::orderBy('created_at', 'DESC')->get();
        return view('admin.data-source.retail-marketing.index', $data);
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

        $rm = new RetailMarketing;
        $rm->fill($request->validated());
        $rm->save();
        return redirect()->route('admin.data-source.index')->with('success', 'Retail Marketing saved successfully');
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
        $data['RetailMarketing'] = RetailMarketing::find($id);
        return view('admin.data-source.retail-marketing.edit', $data);
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
        $rm = RetailMarketing::find($id);
        $rm->fill($request->validated());
        $rm->save();
        return redirect()->route('admin.data-source.index')->with('success', 'Retail Marketing updated successfully');
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
        $rm = RetailMarketing::find($id);
        $rm->delete();
        return redirect()->route('admin.data-source.index')->with('success', 'holiday deleted successfully');
    }


    public function upload(Request $request)
    {
        $this->validate($request, [
            'csv' => 'required|file|mimetypes:text/plain|mimes:txt',
        ]);

        $insertedRowsCount = 0;
        $foundRowsCount = 0;
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

        try {
            DB::beginTransaction();
            $rows = $row = array();
            foreach ($filecontent as $ln => $line) {
                $foundRowsCount++;
                if (strlen($line) < (6 + 7)) {
                    continue;
                }

                $row = array();
                $values = str_getcsv($line);

                if ($headers !== $values && count($values) == count($headers)) {
                    try {
                        $date = Carbon::createFromFormat('Y-m-d', $values[$dateColIndex]);
                    } catch (\Exception $e) {
                        continue;
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

                if (count($rows) > 13000) {
                    // formula for ^ number is max no. of placeholders in mysql (65535) / no. of columns you have in insert statement (5)
                    // I obviously rounded it to something human readable
                    $insertedRowsCount += count($rows);
                    RetailMarketing::insert($rows);
                    $rows = array();
                }
            }

            if (count($rows)) {
                $insertedRowsCount += count($rows);
                RetailMarketing::insert($rows);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);
            abort(422, "Error occured while processing your CSV. Please see log for more information.");
        }

        return redirect()->back()->with('success', "Found $foundRowsCount row(s) in the CSV file. $insertedRowsCount row(s) added in database.");
    }
}
