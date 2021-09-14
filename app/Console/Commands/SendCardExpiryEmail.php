<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentCardExpiryMail;

class SendCardExpiryEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:send-card-expiry-mail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will send emails to users regarding their card expiry prior to a month.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $expiryMonth = Carbon::now()->format('m') + 1;
        $expiryYear = Carbon::now()->format('Y');
        if ($expiryMonth == 13) {
            $expiryMonth = 1;
            $expiryYear++;
        }

        $rows = DB::select("
            SELECT
                users.*,
                payment_details.expiry_month,
                payment_details.expiry_year,
                payment_details.card_number
            FROM
                users
            INNER JOIN
                payment_details ON payment_details.user_id = users.id
            WHERE
                payment_details.expiry_month = $expiryMonth
                AND payment_details.expiry_year = $expiryYear
        ");

        foreach ($rows as $row) {
            Mail::to($row->email)->send(new PaymentCardExpiryMail($row->expiry_year, $row->expiry_month, $row->card_number, $row->name));
        }

        print count($rows) . " users have been notified.\n";
        return 0;
    }
}
