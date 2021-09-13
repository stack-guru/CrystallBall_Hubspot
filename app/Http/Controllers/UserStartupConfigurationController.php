<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserStartupConfigurationRequest;
use App\Models\UserStartupConfiguration;
use Auth;

class UserStartupConfigurationController extends Controller
{
    public function store(UserStartupConfigurationRequest $request)
    {
        $user = Auth::user();

        $rows = [];
        $stepNumbers = $request->step_number;
        foreach ($stepNumbers as $key => $stepNumber) {
            $row = [];
            $row['step_number'] = $stepNumber;
            $row['data_label'] = $request->data_label[$key];
            $row['data_value'] = $request->data_value[$key];
            $row['user_id'] = $user->id;
            $rows[] = $row;
        }

        UserStartupConfiguration::insert($rows);
        $user->startup_configuration_showed_at = new \DateTime();
        $user->save();

        return ['success' => true];
    }
}
