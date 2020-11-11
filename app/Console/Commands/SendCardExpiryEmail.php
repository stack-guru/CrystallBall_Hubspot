<?php

namespace App\Console\Commands;

use DB;
use Illuminate\Console\Command;
use App\Mail\PaymentCardExpiryMail;
use Illuminate\Support\Facades\Mail;

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
        $expiryMonth;
        $expiryYear;
        $rows = DB::statement("
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

        foreach($rows as $row){
            Mail::to($user)->send(new PaymentCardExpiryMail($row->expiry_year, $row->expiry_month, $row->card_number));
        }

        return 0;
    }
}
