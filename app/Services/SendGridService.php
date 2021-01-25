<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendGridService
{
    protected $key;

    public function __construct()
    {
        $this->key = config('services.sendgrid.api.key');
    }

    public function addRecipient(User $user)
    {

        $response = Http::withToken($this->key)
            ->withHeaders([
                "Content-Type: application/json",
            ])
            ->withBody(json_encode([['email' => $user->email, 'first_name' => $user->name, 'e9_D' => $user->created_at->subDays(2)->format('Y-m-d')]]), 'application/json')
            ->post("https://api.sendgrid.com/v3/contactdb/recipients");

        Log::channel('sendgrid')->info('Adding recipient to SendGrid Contact DB.', ['email' => $user->email, 'first_name' => $user->name, 'e9_D' => $user->created_at->subDays(2)->format('Y-m-d')]);
        Log::channel('sendgrid')->debug($response->body());

        if ($response->status() != 201) {
            return false;
        }

        // $response->json()['persisted_recipients'][0];
        return true;
    }

    public function addUserToList(User $user, $listName)
    {
        $list = $this->listFinder($listName);
        if ($list === false) {
            // print "Invalid list name";
            return false;
        }

        $response = Http::withToken($this->key)
            ->withHeaders([
                "Content-Type: application/json",
            ])
            ->withBody(json_encode([
                "list_ids" => [$list['id']],
                "contacts" => [
                    ['email' => $user->email, 'first_name' => $user->name, 'custom_fields' => ['e9_D' => $user->created_at->subDays(2)->format('Y-m-d')]],
                ],
            ]), 'application/json')
            ->put("https://api.sendgrid.com/v3/marketing/contacts");

        Log::channel('sendgrid')->info('Adding user to a list:' . $listName, ['email' => $user->email, 'first_name' => $user->name, 'custom_fields' => ['e9_D' => $user->created_at->subDays(2)->format('Y-m-d')], $list['id']]);
        Log::channel('sendgrid')->debug($response->body());

        if ($response->status() != 202) {
            return false;
        }

        return true;
    }

    public function addUsersToList($users, $listName)
    {
        $list = $this->listFinder($listName);
        if ($list === false) {
            // print "Invalid list name";
            return false;
        }

        $contactsDbArray = array_map(function ($user) {
            return [
                'email' => $user['email'],
                'first_name' => $user['name'],
                // 'custom_fields' => ['e9_D' => Carbon::parse($user['created_at'])->subDays(2)->format('Y-m-d')],
            ];
        }, $users);

        $response = Http::withToken($this->key)
            ->withHeaders([
                "Content-Type: application/json",
            ])
            ->withBody(json_encode([
                "list_ids" => [$list['id']],
                "contacts" => $contactsDbArray,
            ]), 'application/json')
            ->put("https://api.sendgrid.com/v3/marketing/contacts");

        if ($response->status() != 202) {
            return false;
        }

        Log::channel('sendgrid')->info('Adding bulk users to list:' . $listName, $contactsDbArray);
        Log::channel('sendgrid')->debug($response->body());

        return true;
    }

    public function listFinder($listName)
    {
        $fArray = array_values(array_filter(self::LISTS, function ($ar) use ($listName) {return $listName == $ar['name'];}));
        if (count($fArray)) {
            return $fArray[0];
        } else {
            return false;
        }
    }

    const LISTS = [
        [
            "name" => "5 GAa active API",
            "id" => "0dadaf92-7f67-4e06-bd5b-cabd22bd9c79",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/0dadaf92-7f67-4e06-bd5b-cabd22bd9c79",
            ],
        ],
        [
            "name" => "2 GAa Register but didn’t install the extension",
            "id" => "1902cf3c-c4e6-4d75-8e1e-b74b7dc2eb27",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/1902cf3c-c4e6-4d75-8e1e-b74b7dc2eb27",
            ],
        ],
        [
            "name" => "10 GAa Upgraded to PRO",
            "id" => "26bbb9c7-e7e4-416b-9d9f-67a5bae1d851",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/26bbb9c7-e7e4-416b-9d9f-67a5bae1d851",
            ],
        ],
        [
            "name" => "15 GAa past users",
            "id" => "29d735cb-042d-4ee0-a777-2797a5095784",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/29d735cb-042d-4ee0-a777-2797a5095784",
            ],
        ],
        [
            "name" => "7 GAa Today Trial ends",
            "id" => "2d60b1d9-14da-4f68-9dd7-c4cf7c8cc345",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/2d60b1d9-14da-4f68-9dd7-c4cf7c8cc345",
            ],
        ],

        [
            "name" => "3 GAa create your fist annotation",
            "id" => "362a009a-b2d8-4ea8-a217-f6941fd79d31",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/362a009a-b2d8-4ea8-a217-f6941fd79d31",
            ],
        ],

        [
            "name" => "9 GAa Upgraded to Basic",
            "id" => "5f3443f2-d0d5-4420-87d4-c02a565916f8",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/5f3443f2-d0d5-4420-87d4-c02a565916f8",
            ],
        ],

        [
            "name" => "13 GAa submit your feedback to GA",
            "id" => "7575a9c3-cd78-4b7b-ba76-a9edaf45968c",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/7575a9c3-cd78-4b7b-ba76-a9edaf45968c",
            ],
        ],

        [
            "name" => "11 GAa Downgraded to Basic",
            "id" => "9f7e9063-e105-4acf-aba8-c6e586001475",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/9f7e9063-e105-4acf-aba8-c6e586001475",
            ],
        ],
        [
            "name" => "4 GAa active Data Source",
            "id" => "a3c533c4-f17b-4cf1-bcbe-006d1b169e4f",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/a3c533c4-f17b-4cf1-bcbe-006d1b169e4f",
            ],
        ],
        [
            "name" => "6 GAa Two days until Trial ends",
            "id" => "af9a0d6e-e0e0-465c-9839-582ec6b27cc5",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/af9a0d6e-e0e0-465c-9839-582ec6b27cc5",
            ],
        ],

        [
            "name" => "14 GAa API users",
            "id" => "bcc94cbf-81e9-4892-9bd7-7ba7a50b3778",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/bcc94cbf-81e9-4892-9bd7-7ba7a50b3778",
            ],
        ],
        [
            "name" => "12 GAa Downgraded to FREE",
            "id" => "c589814b-5af2-4bdd-9754-20c3bbc1fd06",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/c589814b-5af2-4bdd-9754-20c3bbc1fd06",
            ],
        ],
        [
            "name" => "8 GAa 30 days on FREE",
            "id" => "c73ecc96-6b96-4548-9e0d-f43b3f338fb4",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/c73ecc96-6b96-4548-9e0d-f43b3f338fb4",
            ],
        ],

        [
            "name" => "1 GAa New registrations",
            "id" => "e21a5566-fe57-43aa-82f2-484f6da6214a",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/e21a5566-fe57-43aa-82f2-484f6da6214a",
            ],
        ],
    ];
}
