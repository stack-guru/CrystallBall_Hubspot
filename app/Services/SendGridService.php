<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendGridService
{
    protected $key;

    public function __construct()
    {
        $this->key = config('services.sendgrid.api.key');
    }

    public function addRecipient(User $user)
    {

        // Here explode function is used to separate first_name of user from full name. It is not the recommended way to do it but it will keep things simple.
        $nameChunks = explode(' ', trim($user->name));
        $firstName = $nameChunks[0];
        $lastName = $nameChunks[count($nameChunks) - 1] != $firstName ? $nameChunks[count($nameChunks) - 1] : '';

        $bodyData = [
            [
                'email' => $user->email,
                'first_name' => $firstName,
                'last_name' => $lastName,
                // 'custom_fields' => [['e9_D' => $user->created_at->subDays(2)->format('Y-m-d')]],
            ],
        ];

        $response = Http::withToken($this->key)
            ->withHeaders([
                "Content-Type: application/json",
            ])
            ->withBody(json_encode($bodyData), 'application/json')
            ->post("https://api.sendgrid.com/v3/contactdb/recipients");

        Log::channel('sendgrid')->info('Adding recipient to SendGrid Contact DB.', $bodyData);
        Log::channel('sendgrid')->debug($response->body());

        if ($response->status() != 201) {
            return false;
        }

        // $response->json()['persisted_recipients'][0];
        return true;
    }

    public function addUserToMarketingList(User $user, $listName)
    {
        $list = $this->marketingListFinder($listName);
        if ($list === false) {
            // print "Invalid list name";
            return false;
        }

        $nameChunks = explode(' ', trim($user->name));
        $firstName = $nameChunks[0];
        $lastName = $nameChunks[count($nameChunks) - 1] != $firstName ? $nameChunks[count($nameChunks) - 1] : '';

        $bodyData = [
            "list_ids" => [$list['id']],
            "contacts" => [
                [
                    'email' => $user->email,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    // 'custom_fields' => [['e9_D' => $user->created_at->subDays(2)->format('Y-m-d')]],
                ],
            ],
        ];

        $response = Http::withToken($this->key)
            ->withHeaders([
                "Content-Type: application/json",
            ])
            ->withBody(json_encode($bodyData), 'application/json')
            ->put("https://api.sendgrid.com/v3/marketing/contacts");

        Log::channel('sendgrid')->info('Adding user to a list:' . $listName, $bodyData);
        Log::channel('sendgrid')->debug($response->body());

        if ($response->status() != 202) {
            return false;
        }

        return true;
    }

    public function addUsersToMarketingList($users, $listName)
    {
        $list = $this->marketingListFinder($listName);
        if ($list === false) {
            // print "Invalid list name";
            return false;
        }

        $contactsDbArray = array_map(function ($user) {
            $nameChunks = explode(' ', trim($user['name']));
            $firstName = $nameChunks[0];
            $lastName = $nameChunks[count($nameChunks) - 1] != $firstName ? $nameChunks[count($nameChunks) - 1] : '';
            return [
                'email' => $user['email'],
                'first_name' => $firstName,
                'last_name' => $lastName,
                // 'custom_fields' => [['e9_D' => Carbon::parse($user['created_at'])->subDays(2)->format('Y-m-d')]],
            ];
        }, $users);

        $bodyData = [
            "list_ids" => [$list['id']],
            "contacts" => $contactsDbArray,
        ];

        $response = Http::withToken($this->key)
            ->withHeaders([
                "Content-Type: application/json",
            ])
            ->withBody(json_encode($bodyData), 'application/json')
            ->put("https://api.sendgrid.com/v3/marketing/contacts");

        if ($response->status() != 202) {
            return false;
        }

        Log::channel('sendgrid')->info('Adding bulk users to list:' . $listName, $bodyData);
        Log::channel('sendgrid')->debug($response->body());

        return true;
    }

    public function marketingListFinder($listName)
    {
        $fArray = array_values(array_filter(self::MARKETING_LISTS, function ($ar) use ($listName) {return $listName == $ar['name'];}));
        if (count($fArray)) {
            return $fArray[0];
        } else {
            return false;
        }
    }

    const MARKETING_LISTS = [
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
            "name" => "2 days on FREE",
            "id" => "5dcdbcce-da56-496e-aa71-339df985f420",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/5dcdbcce-da56-496e-aa71-339df985f420",
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

    public function addUserToContactList(User $user, $listName, $customFields = [])
    {
        $list = $this->contactListFinder($listName);
        if ($list === false) {
            // print "Invalid list name";
            return false;
        }

        $nameChunks = explode(' ', trim($user->name));
        $firstName = $nameChunks[0];
        $lastName = $nameChunks[count($nameChunks) - 1] != $firstName ? $nameChunks[count($nameChunks) - 1] : '';

        $contact = [
            'email' => $user->email,
            'first_name' => $firstName,
            'last_name' => $lastName,
        ];

        if (count($customFields)) {
            $contact['custom_fields'] = $customFields;
        }

        $bodyData = [
            "list_ids" => [$list['id']],
            "contacts" => [$contact],
        ];

        $response = Http::withToken($this->key)
            ->withHeaders([
                "Content-Type: application/json",
            ])
            ->withBody(json_encode($bodyData), 'application/json')
            ->put("https://api.sendgrid.com/v3/marketing/contacts");

        Log::channel('sendgrid')->info('Adding user to a list:' . $listName, $bodyData);
        Log::channel('sendgrid')->debug($response->body());

        if ($response->status() != 202) {
            return false;
        }

        return true;
    }

    public function contactListFinder($listName)
    {
        $fArray = array_values(array_filter(self::CONTACT_LISTS, function ($ar) use ($listName) {return $listName == $ar['name'];}));
        if (count($fArray)) {
            return $fArray[0];
        } else {
            return false;
        }
    }

    const CONTACT_LISTS = [
        [
            "name" => "Google Updates Activated",
            "id" => "1dcc7619-d70e-4ebb-873f-cd60c5f04852",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/1dcc7619-d70e-4ebb-873f-cd60c5f04852",
            ],
        ],
        [
            "name" => "Google Updates Deactivated from Trial to Free",
            "id" => "7a6436f2-8667-4a73-86cc-99e2c135b1e7",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/7a6436f2-8667-4a73-86cc-99e2c135b1e7",
            ],
        ],
        [
            "name" => "Google Updates Deactivated manually",
            "id" => "d775f56f-f2f3-4f24-8c9a-9b4947b349f5",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/d775f56f-f2f3-4f24-8c9a-9b4947b349f5",
            ],
        ],
        [
            "name" => "Holidays for [Country_name] Activated",
            "id" => "dfc4253d-9804-459d-a2c1-ea49f171dd45",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/dfc4253d-9804-459d-a2c1-ea49f171dd45",
            ],
        ],
        [
            "name" => "Holidays for [Country_name] Deactivated because from Trial to Free",
            "id" => "3613df2b-ddc1-4789-83c2-e03517ea2248",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/3613df2b-ddc1-4789-83c2-e03517ea2248",
            ],
        ],
        [
            "name" => "Holidays for [Country_name] Deactivated manually",
            "id" => "efea3b1c-c482-42f6-ba0c-33bdd9946435",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/efea3b1c-c482-42f6-ba0c-33bdd9946435",
            ],
        ],
        [
            "name" => "New CSV [file name] Uploaded",
            "id" => "3a74b5d9-4357-4ab2-8041-3d97c0f9daa2",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/3a74b5d9-4357-4ab2-8041-3d97c0f9daa2",
            ],
        ],
        [
            "name" => "News Alerts for [keywords] Activated",
            "id" => "fcccf71e-4472-40a7-8b61-bbba75db9356",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/fcccf71e-4472-40a7-8b61-bbba75db9356",
            ],
        ],
        [
            "name" => "News Alerts for [keywords] Deactivated because from Trial to Free",
            "id" => "3758aaf5-5c22-44ad-8955-2a6c444a3063",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/3758aaf5-5c22-44ad-8955-2a6c444a3063",
            ],
        ],
        [
            "name" => "News Alerts for [keywords] Deactivated manually",
            "id" => "2a5f2467-dee8-4cba-9e22-62b7363de9e0",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/2a5f2467-dee8-4cba-9e22-62b7363de9e0",
            ],
        ],
        [
            "name" => "Retail Marketing Dates Activated",
            "id" => "976d6e0d-c288-4e92-87e5-c79ba1307c83",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/976d6e0d-c288-4e92-87e5-c79ba1307c83",
            ],
        ],
        [
            "name" => "Retail Marketing Dates Deactivated from Trial to Free",
            "id" => "8c9042c3-a24e-42ec-b06e-05b2aeab3b06",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/8c9042c3-a24e-42ec-b06e-05b2aeab3b06",
            ],
        ],
        [
            "name" => "Retail Marketing Dates Deactivated manually",
            "id" => "19b1283c-cc50-47f7-83a6-417e1a3fc1a6",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/19b1283c-cc50-47f7-83a6-417e1a3fc1a6",
            ],
        ],
        [
            "name" => "Weather for [cities] Activated",
            "id" => "7a4816b7-9d44-4d7b-a7f3-0abf4f648f06",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/7a4816b7-9d44-4d7b-a7f3-0abf4f648f06",
            ],
        ],
        [
            "name" => "Weather for [cities] Deactivated from Trial to Free",
            "id" => "ad0fff61-faea-4817-8b09-8f1f37a2f383",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/ad0fff61-faea-4817-8b09-8f1f37a2f383",
            ],
        ],
        [
            "name" => "Weather for [cities] Deactivated manually",
            "id" => "0b1d7c71-f5c0-4f18-bf90-341c76b92332",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/0b1d7c71-f5c0-4f18-bf90-341c76b92332",
            ],
        ],
        [
            "name" => "Website Monitoring Activated",
            "id" => "ed7c6f19-b96c-4755-b27e-647b03312e88",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/ed7c6f19-b96c-4755-b27e-647b03312e88",
            ],
        ],
        [
            "name" => "Website Monitoring Deactivated because Trial to Free",
            "id" => "03e3d09b-caa9-446c-8bec-1a0220d499f9",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/03e3d09b-caa9-446c-8bec-1a0220d499f9",
            ],
        ],
        [
            "name" => "Website Monitoring Deactivated because URL was removed",
            "id" => "723b7916-24f3-494e-ac3b-7c72472b3464",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/723b7916-24f3-494e-ac3b-7c72472b3464",
            ],
        ],
        [
            "name" => "WordPress Activated",
            "id" => "f38f8690-9185-4288-817a-1a9abf0bcf5f",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/f38f8690-9185-4288-817a-1a9abf0bcf5f",
            ],
        ],
        [
            "name" => "WordPress Deactivated because from Trial to Free",
            "id" => "01767785-5e3d-4d86-8979-08da4dacb1a8",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/01767785-5e3d-4d86-8979-08da4dacb1a8",
            ],
        ],
        [
            "name" => "WordPress Deactivated manually",
            "id" => "80c9fee6-efa1-4404-9c33-c72eca419ace",
            "_metadata" => [
                "self" => "https://api.sendgrid.com/v3/marketing/lists/80c9fee6-efa1-4404-9c33-c72eca419ace",
            ],
        ],
    ];
}
