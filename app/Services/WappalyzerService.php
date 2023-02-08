<?php

namespace App\Services;

use App\Models\CompanyInfo;
use App\Models\websiteTechnologyLookup;
use App\Models\WebsiteTechnologyName;
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
        $websiteTechLookup -> save();
        foreach($techArray as $technology)
        {
            WebsiteTechnologyName::create([
                'name' => $technology['name'],
                'website_technology_lookup_id' => $websiteTechLookup->id
            ]);
        }
        //save tech lookup (must improve later.)
    }
}
