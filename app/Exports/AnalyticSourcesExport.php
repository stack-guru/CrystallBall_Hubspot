<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class AnalyticSourcesExport implements FromCollection, WithTitle, WithHeadings
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
            'Source Name',
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
        return 'Analytic Sources';
    }
}
