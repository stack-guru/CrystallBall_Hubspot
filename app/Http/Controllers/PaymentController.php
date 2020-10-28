<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    //

    public function checkPayment($id){


      $response=$this->subscribePlan($id);
      return $response;
}

public function subscribePlan($data){

        return ['status'=>'plan subscribed '.$data,'location'=>'/annotation'];

}


}
