<?php

namespace Database\Factories;

use App\Models\Annotation;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnnotationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Annotation::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'category' => $this->faker->randomElement(['Advertiser', 'Advisors', 'AdWords', 'Affiliates', 'Analytics', 'Billboard', 'Blog', 'Theme', 'Facebook', 'Paid Search', 'Content Update', 'Site Improvement']),
            'event_type' => $this->faker->randomElement(['Annotations', 'Sales', 'Holidays', 'event_type']),
            'event_name' => $this->faker->randomElement(['The Daily Podcast', 'Newsletter Sent', 'Spike in Referral Traffic', 'Nav Menu Update', 'Lowered Bing Ads spend by 25%', 'Client Site']),

            'url' => null,
            'description' => $this->faker->paragraph(4),
            'title' => $this->faker->sentence(),
            'show_at' => $this->faker->dateTimeThisYear(),
            'type' => $this->faker->randomelement(['public', 'test', 'type']),

            'is_enabled' => $this->faker->boolean(),
            'added_by' => $this->faker->randomElement(['manual', 'csv-upload', 'api']),
        ];
    }
}
