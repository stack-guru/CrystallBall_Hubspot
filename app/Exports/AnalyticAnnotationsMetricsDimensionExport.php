<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class AnalyticAnnotationsMetricsDimensionExport implements FromCollection, WithTitle, WithHeadings
{
    public $collection;

    public function __construct($collection)
    {
        $this->collection = collect($collection);
    }

    public function collection()
    {
        return $this->collection;
    }

    public function headings(): array
    {
        return [
            'Event Name',
            'Category',
            'Show At',
            'Description',
            'Statistics Date',
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
        return 'Annotations Metrics Dimension';
    }
}
