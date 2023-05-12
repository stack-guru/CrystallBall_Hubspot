<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class AnalyticdeviceCategoriesExport implements FromCollection, WithTitle, WithHeadings
{
    public $collection;

    public function __construct($collection)
    {
        $this->collection = $collection;
    }

    public function collection()
    {
        return $this->collection;
    }

    public function headings(): array
    {
        return [
            'Device Category',
            'Users Count',
            'Events Count',
            'Conversions Count'
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Analytic Device Category';
    }
}
