<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnotationRequest;
use App\Models\Annotation;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;

class AnnotationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('ui/app');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function create()
    {
        return view('ui/app');
    }

    public function store(AnnotationRequest $request)
    {
        $user_data = Auth::id();

        $annotation = new Annotation;
        $annotation->fill($request->validated());
        $annotation->user_id = $user_data;
        $annotation->is_enabled = true;
        $annotation->save();

        return ['annotation' => $annotation];
    }

    public function show($id)
    {
        return view('ui/app');
    }

    public function edit($id)
    {
        return view('ui/app');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Annotation  $annotation
     * @return \Illuminate\Http\Response
     */
    public function update(AnnotationRequest $request, $id)
    {

        $user_id = Auth::id();
        $annotation = Annotation::where(['user_id' => $user_id, 'id' => $id])->first();
        if (!$annotation) {
            abort(404);
        }

        $annotation->update($request->validated());
        $annotation->load('annotationGaAccounts');

        return ['annotation' => $annotation];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Annotation  $annotation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Annotation $annotation)
    {
        $user_data = Auth::id();
        if ($user_data !== $annotation->user_id) {
            abort(404);
        }

        $annotation->delete();
        return ["success" => true];
    }

    public function uiIndex(Request $request)
    {
        $user = Auth::user();

        $annotationsQuery = "SELECT `TempTable`.*, `google_accounts`.`id` AS google_account_id, `google_accounts`.`email` AS google_account_email FROM (";
        $annotationsQuery .= "select is_enabled, google_account_id, `show_at`, created_at, `annotations`.`id`, `category`, `event_name`, `url`, `description` from `annotations` where `user_id` = " . $user->id;

        if ($request->query('google_account_id') && $request->query('google_account_id') !== '*') {
            $annotationsQuery .= " and google_account_id = " . $request->query('google_account_id');
        }
        if ($user->is_ds_holidays_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select 1, null, holiday_date AS show_at, holiday_date AS created_at, null, CONCAT(category, \" Holiday\"), event_name, NULL as url, description from `holidays` inner join `user_data_sources` as `uds` on `uds`.`country_name` = `holidays`.`country_name` where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'holidays'";
        }
        if ($user->is_ds_google_algorithm_updates_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select 1, null, update_date AS show_at, update_date AS created_at, null, category, event_name, NULL as url, description from `google_algorithm_updates`";
        }
        if ($user->is_ds_retail_marketing_enabled) {
            $annotationsQuery .= " union ";
            $annotationsQuery .= "select 1, null, show_at, show_at as created_at, null, category, event_name, NULL as url, description from `retail_marketings` inner join `user_data_sources` as `uds` on `uds`.`retail_marketing_id` = `retail_marketings`.id where `uds`.`user_id` = " . $user->id . " and `uds`.`ds_code` = 'retail_marketings'";
        }
        $annotationsQuery .= ") AS TempTable";

        $annotationsQuery .= " LEFT JOIN google_accounts ON TempTable.google_account_id = google_accounts.id";

        if ($request->query('sortBy') == "added") {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } elseif ($request->query('sortBy') == "date") {
            $annotationsQuery .= " ORDER BY TempTable.show_at DESC";
        } elseif ($request->query('google_account_id')) {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        } else {
            $annotationsQuery .= " ORDER BY TempTable.created_at DESC";
        }
        $annotations = DB::select($annotationsQuery);

        return ['annotations' => $annotations];
    }
    public function uiShow($id)
    {
        $annotation = Annotation::findOrFail($id);
        return ['annotation' => $annotation];
    }

    public function upload(Request $request)
    {
        $this->validate($request, [
            'csv' => 'required|file|mimetypes:text/plain|mimes:txt',
            'date_format' => 'required',
        ]);

        $filepath = $request->file('csv')->getRealPath();

        $filecontent = file($filepath);
        $headers = str_getcsv($filecontent[0]);

        if (count($headers) !== 5) {
            return response()->json(['message' => 'Invalid number of columns'], 422);
        }
        foreach ($headers as $header) {
            if (!in_array($header, [
                'category', 'event_name',
                'url', 'description', 'show_at',
            ])) {
                return response()->json(['message' => 'Invalid CSV file headers'], 422);
            }
        }

        $user_id = Auth::id();

        $rows = array();
        foreach ($filecontent as $line) {
            if (strlen($line) < (6 + 7)) {
                continue;
            }

            $row = array();
            $values = str_getcsv($line);

            if ($headers !== $values && count($values) == count($headers)) {
                for ($i = 0; $i < count($headers); $i++) {
                    if ($headers[$i] == 'show_at') {
                        try{
                            $date = Carbon::createFromFormat($request->date_format, $values[$i]);
                            $row['show_at'] = $date->format('Y-m-d');
                        }catch (\Exception $ex){
                           return ['message'=>"Please select correct date format according to your CSV file from the list below."];
                        }

                    } else if ($headers[$i] == 'url') {
                        $row['url'] = $values[$i];
                    } else {
                        $row[trim(str_replace('"', "", $headers[$i]))] = preg_replace("/[^A-Za-z0-9-_. ]/", '', trim(str_replace('"', "", $values[$i])));
                    }
                }

                $row['user_id'] = $user_id;
                $row['google_account_id'] = $request->google_account_id;
                array_push($rows, $row);

            }

            if (count($rows) > 99) {
                Annotation::insert($rows);
                $rows = array();
            }
        }

        if (count($rows)) {
            Annotation::insert($rows);
        }

        return ['success' => true];
    }

    public function getCategories(){

        $categories=Annotation::select('category')->distinct()->ofCurrentUser()->orderBy('category')->get();
        return ['categories'=>$categories];
}

}
