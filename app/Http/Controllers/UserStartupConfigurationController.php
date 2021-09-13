<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserStartupConfigurationRequest;
use App\Models\UserStartupConfiguration;
use Auth;
use App\Models\ChecklistItem;
use App\Models\UserChecklistItem;

class UserStartupConfigurationController extends Controller
{
    public function store(UserStartupConfigurationRequest $request)
    {
        $user = Auth::user();

        $startupConfigurations = [];
        $userChecklistItems = [];

        $stepNumbers = $request->step_number;
        foreach ($stepNumbers as $key => $stepNumber) {

            $startupConfiguration = [];
            $startupConfiguration['step_number'] = $stepNumber;
            $startupConfiguration['data_label'] = $request->data_label[$key];
            $startupConfiguration['data_value'] = $request->data_value[$key];
            $startupConfiguration['user_id'] = $user->id;
            $startupConfigurations[] = $startupConfiguration;

            if (in_array($request->data_label[$key], ['IMPORT_OLD_ANNOTATIONS', 'automations', 'integrations'])) {
                $userChecklistItem = [];
                switch ($request->data_label[$key]) {
                    case 'IMPORT_OLD_ANNOTATIONS':
                        $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'IMP_ANN_CSV')->first()->id;
                        $userChecklistItem['user_id'] = $user->id;
                        $userChecklistItems[] = $userChecklistItem;

                        break;
                    case  'automations':
                        $automations = json_decode($request->data_value[$key]);

                        foreach ($automations as $automation) {
                            switch ($automation) {
                                case 'WEB_MONITORING':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'AUTO_WEB_MON')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'GOOGLE_ALERT':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'AUTO_GOOG_ALERT')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'GOOGLE_UPDATES':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'AUTO_GOOG_UPD')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'RETAIL_MARKETING_DATES':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'AUTO_RET_MKT_DTE')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'HOLIDAYS':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'AUTO_HOLIDAYS')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'WEATHER_ALERTS':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'AUTO_WEA_ALERTS')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'WORDPRESS_UPDATES':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'AUTO_WP_UPDATES')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                            }
                        }
                        break;
                    case  'integrations':
                        $integrations = json_decode($request->data_value[$key]);
                        foreach ($integrations as $integration) {
                            switch ($integration) {
                                case 'ADWORDS':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_ADWORDS')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'MAILCHIMP':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_MAILCHIMP')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'SHOPIFY':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_SHOPIFY')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'SLACK':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_SLACK')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'ASANA':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_ASANA')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'JIRA':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_JIRA')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'TRELLO':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_TRELLO')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'GITHUB':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_GITHUB')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'BITBUCKET':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_BITBUCKET')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'GOOGLE_SHEETS':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_GOOG_SHTS')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                                case 'OTHER':
                                    $userChecklistItem['checklist_item_id'] = ChecklistItem::where('name', 'CONN_A_TOOL')->first()->id;
                                    $userChecklistItem['user_id'] = $user->id;
                                    $userChecklistItems[] = $userChecklistItem;
                                    break;
                            }
                        }
                        break;
                }
            }
        }

        UserStartupConfiguration::insert($startupConfigurations);
        if (count($userChecklistItems)) userChecklistItem::insert($userChecklistItems);

        $user->startup_configuration_showed_at = new \DateTime();
        $user->save();

        return ['success' => true];
    }
}
