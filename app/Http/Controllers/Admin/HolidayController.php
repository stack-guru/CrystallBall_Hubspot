<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\HolidayRequest;
use App\Models\Holiday;
use Carbon\Carbon;
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

        $data['holidays'] = Holiday::orderBy('created_at', 'DESC')->get();
        return view('admin/data-source/holiday/index', $data);
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
        $holiday = new Holiday;
        $holiday->fill($request->validated());
        $holiday->save();
        return redirect()->route('admin.data-source.index')->with('success', 'holiday saved successfully');
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
        $data['holiday'] = Holiday::find($id);
        return view('admin.data-source.holiday.edit', $data);
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
        $holiday = Holiday::find($id);
        $holiday->fill($request->validated());
        $holiday->save();
        return redirect()->route('admin.data-source.index')->with('success', 'holiday updated successfully');
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
        $holiday = Holiday::find($id);
        $holiday->delete();
        return redirect()->route('admin.data-source.index')->with('error', 'holiday deleted successfully');

    }

    public function upload(Request $request)
    {
        $this->validate($request, [
            'csv' => 'required|file|mimetypes:text/plain|mimes:txt',
        ]);

        $filepath = $request->file('csv')->getRealPath();

        $filecontent = file($filepath);
        $headers = str_getcsv($filecontent[0]);

        if (count($headers) !== 7) {
            return redirect()->back()->with('error', 'Invalid number of columns (' . count($headers) . ').');
        }
        foreach ($headers as $header) {
            if (!in_array($header, [
                'category', 'event_name', 'event_type', 'url',
                'country_name', 'description', 'holiday_date', 'description2',
            ])) {
                return redirect()->back()->with('error', 'Invalid CSV file headers (' . $header . ').');
            }
        }

        $dateColIndex = array_search('holiday_date', $headers);

        $rows = $row = array();
        foreach ($filecontent as $ln => $line) {
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
                    // return ['message'=>"Please upload file with '2020-12-31' date format given is $values[$i] on line $ln column $i."];
                }
                for ($i = 0; $i < count($headers); $i++) {
                    if ($headers[$i] == 'holiday_date') {
                        $row['holiday_date'] = $values[$i];
                    } else if ($headers[$i] == 'url') {
                        $row['url'] = $values[$i];
                    } else {
                        $row[trim(str_replace('"', "", $headers[$i]))] = preg_replace("/[^A-Za-z0-9-_. ]/", '', trim(str_replace('"', "", $values[$i])));
                    }
                }

                array_push($rows, $row);

            }

            if (count($rows) > 99) {
                Holiday::insert($rows);
                $rows = array();
            }
        }

        if (count($rows)) {
            Holiday::insert($rows);
        }

        return redirect()->back()->with('success', true);
    }

}
