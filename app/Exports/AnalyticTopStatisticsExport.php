<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithMapping;

class AnalyticTopStatisticsExport implements FromCollection, WithTitle, WithHeadings
{
    public $collection;

    public function __construct($collection)
    {
        $this->getArray($collection['statistics']);
    }

    public function getArray($data)
    {
        $collection[0]['Total Users'] = $data->sum_users_count;
        $collection[0]['Total Sessions'] = $data->sum_sessions_count;
        $collection[0]['Total Events'] = $data->sum_events_count;
        $collection[0]['Total Conversions'] = $data->sum_conversions_count;
        $this->collection = collect($collection);
    }
    public function collection()
    {
        return $this->collection;
    }
    
    public function headings(): array
    {
        return [
            'Total Users',
            'Total Sessions',
            'Total Events',
            'Total Conversions'
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Analytic Top Statistics';
    }
}
