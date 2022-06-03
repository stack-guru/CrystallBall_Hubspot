<?php

namespace App\Jobs;

use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Http;

use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MarkSalesInFirstPromoter implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $user, $pricePlan, $totalPaymentAmount, $transactionId;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user, PricePlan $pricePlan, $totalPaymentAmount, $transactionId)
    {
        $this->user = $user;
        $this->pricePlan = $pricePlan;
        $this->totalPaymentAmount = $totalPaymentAmount;
        $this->transactionId = $transactionId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $url = "https://firstpromoter.com/api/v1/track/sale";

        $body = [
            'email' => $this->user->email,
            'uid' => config('services.first_promoter.api.key'),
            'currency' => 'USD',
            'event_id' => $this->transactionId,
            'plan' => $this->pricePlan->name,
            'amount' => (int) ($this->totalPaymentAmount * 100) // Service accepts payment price in cents.
        ];
        $response = Http::withHeaders([
            'x-api-key' => config('services.first_promoter.api.key'),
            // 'Content-Type' => 'application/x-www-form-urlencoded'
        ])
            ->post($url, $body);

        Log::channel('firstpromoter')->info(['request' => $body, 'response' => $response->body(), 'status_code' => $response->status()]);
    }
}
