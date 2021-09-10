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

        UserStartupWizard::insert($rows);
        $user->startup_wizard_showed_at = new \DateTime();
        $user->save();

        return ['success' => true];
    }
}
