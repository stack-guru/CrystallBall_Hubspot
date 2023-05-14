<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithMapping;

class ConsoleTopStatisticsExport implements FromCollection, WithTitle, WithHeadings
{
    public $collection;

    public function __construct($collection)
    {
        $this->getArray($collection);
    }

    public function getArray($data)
    {
        $collection[0]['Total Clicks'] = $data->sum_clicks_count ?? 0;
        $collection[0]['Total Impressions'] = $data->sum_impressions_count ?? 0;
        $collection[0]['Max Click Through Rate'] = $data->max_ctr_count ?? 0;
        $collection[0]['Min Position Rank'] = $data->min_position_rank ?? 0;
        $this->collection = collect($collection);
    }
    public function collection()
    {
        return $this->collection;
    }
    
    public function headings(): array
    {
        return [
            'Total Clicks',
            'Total Impressions',
            'Max Click Through Rate',
            'Min Position Rank'
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Console Top Statistics';
    }
}
