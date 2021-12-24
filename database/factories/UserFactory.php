<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PricePlan;
use App\Models\UserDataSource;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterMaking(function (User $user) {
            //
        })->afterCreating(function (User $user) {
            $userDataSource = new UserDataSource;
            $userDataSource->user_id = $user->id;
            $userDataSource->ds_code = 'wordpress_updates';
            $userDataSource->ds_name = 'WordpressUpdate';
            $userDataSource->country_name = null;
            $userDataSource->retail_marketing_id = null;
            $userDataSource->value = 'last year';
            $userDataSource->save();
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),

            'price_plan_id' => PricePlan::where('is_enabled', true)->inRandomOrder()->first()->id,
            'price_plan_expiry_date' => $this->faker->dateTimeBetween('now', '+4 week'),

            'is_ds_holidays_enabled' => $this->faker->boolean(),
            'is_ds_google_algorithm_updates_enabled' => $this->faker->boolean(),
            'is_ds_weather_alerts_enabled' => $this->faker->boolean(),
            'is_ds_retail_marketing_enabled' => $this->faker->boolean(),
            'is_ds_google_alerts_enabled' => $this->faker->boolean(),
            'is_ds_wordpress_updates_enabled' => $this->faker->boolean(),
            'is_ds_web_monitors_enabled' => $this->faker->boolean(),

            'user_level' => User::ADMIN,
            'department' => $this->faker->jobTitle(),

            'team_name' => $this->faker->jobTitle(),

            'data_source_tour_showed_at' => null,
            'google_accounts_tour_showed_at' => null,
            'startup_configuration_showed_at' => null
        ];
    }
}
