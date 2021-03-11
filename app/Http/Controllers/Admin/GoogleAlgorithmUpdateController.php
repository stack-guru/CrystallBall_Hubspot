<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\GoogleAlgorithmUpdateRequest;
use App\Models\GoogleAlgorithmUpdate;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GoogleAlgorithmUpdateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $googleAlgorithmUpdates = GoogleAlgorithmUpdate::orderBy('update_date', 'ASC')->get();
        return view('admin/data-source/google-algorithm/index')->with('googleAlgorithmUpdates', $googleAlgorithmUpdates);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin/data-source/google-algorithm/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(GoogleAlgorithmUpdateRequest $request)
    {
        $googleAlgorithmUpdate = new GoogleAlgorithmUpdate;
        $googleAlgorithmUpdate->fill($request->validated());
        $googleAlgorithmUpdate->is_confirmed = $request->has('is_confirmed');
        $googleAlgorithmUpdate->save();
        return redirect()->route('admin.data-source.google-algorithm-update.index')->with('success', true);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\GoogleAlgorithmUpdate  $googleAlgorithmUpdate
     * @return \Illuminate\Http\Response
     */
    public function edit(GoogleAlgorithmUpdate $googleAlgorithmUpdate)
    {
        return view('admin/data-source/google-algorithm/edit')->with('googleAlgorithmUpdate', $googleAlgorithmUpdate);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\GoogleAlgorithmUpdate  $googleAlgorithmUpdate
     * @return \Illuminate\Http\Response
     */
    public function update(GoogleAlgorithmUpdateRequest $request, GoogleAlgorithmUpdate $googleAlgorithmUpdate)
    {
        $googleAlgorithmUpdate->fill($request->validated());
        $googleAlgorithmUpdate->is_confirmed = $request->has('is_confirmed');
        $googleAlgorithmUpdate->save();
        return redirect()->route('admin.data-source.google-algorithm-update.index')->with('success', true);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\GoogleAlgorithmUpdate  $googleAlgorithmUpdate
     * @return \Illuminate\Http\Response
     */
    public function destroy(GoogleAlgorithmUpdate $googleAlgorithmUpdate)
    {
        $googleAlgorithmUpdate->delete();
        return redirect()->route('admin.data-source.google-algorithm-update.index')->with('success', true);
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
            return response()->json(['message' => 'Invalid number of columns'], 422);
        }
        foreach ($headers as $header) {
            if (!in_array($header, [
                'category', 'event_name', 'description', 'update_date', 'url',
            ])) {
                return redirect()->back()->with('error', 'Invalid CSV file headers.');
            }
        }

        $dateColIndex = array_search('update_date', $headers);

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
                    if ($headers[$i] == 'update_date') {
                        $row['update_date'] = $values[$i];
                    } else if ($headers[$i] == 'url') {
                        $row['url'] = $values[$i];
                    } else {
                        $row[trim(str_replace('"', "", $headers[$i]))] = preg_replace("/[^A-Za-z0-9-_. ]/", '', trim(str_replace('"', "", $values[$i])));
                    }
                }

                array_push($rows, $row);

            }

            if (count($rows) > 99) {
                GoogleAlgorithmUpdate::insert($rows);
                $rows = array();
            }
        }

        if (count($rows)) {
            GoogleAlgorithmUpdate::insert($rows);
        }

        return redirect()->back()->with('success', true);
    }
}
