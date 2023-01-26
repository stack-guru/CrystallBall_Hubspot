<?php

namespace App\Services;

use App\Models\CompanyInfo;
use App\Models\websiteTechnologyLookup;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class WappalyzerService
{
    /**
     * @var string
     */
    private $baseUrl;

    /**
     * @var \Illuminate\Http\Client\Factory
     */

    public function __construct()
    {
        //    
    }

    /**
     * Get data from Wappalyzer (nickname)
     *
     */
    public function getData($companyDomain,$name)
    {
        $this->baseUrl    = "https://api.wappalyzer.com/v2/lookup/?sets=all&recursive=false&urls=https://www." . $companyDomain . "&live=true";
        $response = Http::withHeaders([
            'x-api-key' => config('services.wappalyzer.data_api_url'),
        ])
        ->get($this->baseUrl);
        if ($response->status() != Response::HTTP_OK) {
            // throw new TwitterException("Error Processing Request", Response::HTTP_NOT_IMPLEMENTED);
        }else{
            $data = $response->json();
            $this->saveCompanyData($data,$name);
            $this->saveWebsiteTechnologyData($data);
        }
    }
    public function saveCompanyData($data,$name)
    {
        $companyInfo = new CompanyInfo();
        $companyInfo -> user_name =  $name;
        $companyInfo -> company_name = @$data[0]['companyName'];
        $companyInfo -> company_size = @$data[0]['companySize'];
        $companyInfo -> industry = @$data[0]['industry'];
        $companyInfo -> language = @$data[0]['language'];
        $companyInfo -> ip = @$data[0]['ipCountry'];
        $companyInfo -> location = empty($data[0]['locations'][0]) ? null : $data[0]['locations'][0];
        $companyInfo -> facebook = empty($data[0]['facebook'][0]) ? null : $data[0]['facebook'][0];
        $companyInfo -> twitter = empty($data[0]['twitter'][0]) ? null : $data[0]['twitter'][0];
        $companyInfo -> linkedin = empty($data[0]['linkedin'][0]) ? null : $data[0]['linkedin'][0];
        $companyInfo -> instagram = empty($data[0]['instagram'[0]]) ? null : $data[0]['instagram'][0];   
        $companyInfo -> save();                                         //save company info
    }
    public function saveWebsiteTechnologyData($data)
    {
        $websiteTechLookup = new websiteTechnologyLookup();
        $techArray = @$data[0]['technologies'];
        $websiteTechLookup -> site_url = @$data[0]['url'];
        $websiteTechLookup -> tech1 = empty($techArray[0]['name']) ? null : $techArray[0]['name'];
        $websiteTechLookup -> tech2 = empty($techArray[1]['name']) ? null : $techArray[1]['name'];
        $websiteTechLookup -> tech3 = empty($techArray[2]['name']) ? null : $techArray[2]['name'];
        $websiteTechLookup -> tech4 = empty($techArray[3]['name']) ? null : $techArray[3]['name'];
        $websiteTechLookup -> tech5 = empty($techArray[4]['name']) ? null : $techArray[4]['name'];
        $websiteTechLookup -> tech6 = empty($techArray[5]['name']) ? null : $techArray[5]['name'];
        $websiteTechLookup -> tech7 = empty($techArray[6]['name']) ? null : $techArray[6]['name'];
        $websiteTechLookup -> tech8 = empty($techArray[7]['name']) ? null : $techArray[7]['name'];
        $websiteTechLookup -> tech9 = empty($techArray[8]['name']) ? null : $techArray[8]['name'];
        $websiteTechLookup -> tech10 = empty($techArray[9]['name']) ? null : $techArray[9]['name'];
        $websiteTechLookup -> tech11 = empty($techArray[10]['name']) ? null : $techArray[10]['name'];
        $websiteTechLookup -> tech12 = empty($techArray[11]['name']) ? null : $techArray[11]['name'];
        $websiteTechLookup -> tech13 = empty($techArray[12]['name']) ? null : $techArray[12]['name'];
        $websiteTechLookup -> tech14 = empty($techArray[13]['name']) ? null : $techArray[13]['name'];
        $websiteTechLookup -> tech15 = empty($techArray[14]['name']) ? null : $techArray[14]['name'];
        $websiteTechLookup -> tech16 = empty($techArray[15]['name']) ? null : $techArray[15]['name'];
        $websiteTechLookup -> tech17 = empty($techArray[16]['name']) ? null : $techArray[16]['name'];
        $websiteTechLookup -> tech18 = empty($techArray[17]['name']) ? null : $techArray[17]['name'];
        $websiteTechLookup -> tech19 = empty($techArray[18]['name']) ? null : $techArray[18]['name'];
        $websiteTechLookup -> tech20 = empty($techArray[19]['name']) ? null : $techArray[19]['name'];
        $websiteTechLookup -> save();
        //save tech lookup (must improve later.)
    }
}
