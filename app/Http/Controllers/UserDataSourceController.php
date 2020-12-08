<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserDataSourceRequest;
use App\Models\UserDataSource;
use Auth;
use Illuminate\Http\Request;

class UserDataSourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        return ['data_sources' => UserDataSource::select('id', 'ds_code', 'ds_name', 'country_name')->ofCurrentUser()->orderBy('ds_code')->get()];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserDataSourceRequest $request)
    {
        $userDataSource = new UserDataSource;
        $userDataSource->fill($request->validated());
        $userDataSource->user_id = Auth::id();
        $userDataSource->save();

        return ['user_data_source' => $userDataSource];
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserDataSource  $userDataSource
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserDataSource $userDataSource)
    {
        if ($userDataSource->user_id !== Auth::id()) {
            abort(404);
        }

        $userDataSource->delete();

        return ['success' => true,'data_source'=>$userDataSource];
    }
}
