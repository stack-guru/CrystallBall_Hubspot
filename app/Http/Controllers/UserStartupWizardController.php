<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserStartupWizardRequest;
use App\Models\UserStartupWizard;
use Auth;

class UserStartupWizardController extends Controller
{
    public function store(UserStartupWizardRequest $request)
    {
        $userId = Auth::id();

        $rows = [];
        $stepNumbers = $request->step_number;
        foreach ($stepNumbers as $key => $stepNumber) {
            $row = [];
            $row['step_number'] = $stepNumber;
            $row['data_label'] = $request->data_label[$key];
            $row['data_value'] = $request->data_value[$key];
            $row['user_id'] = $userId;
            $rows[] = $row;
        }

        UserStartupWizard::insert($rows);

        return ['success' => true];
    }
}
