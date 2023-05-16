<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class ConsoleclicksImpressionsDaysAnnotationsExport implements FromCollection, WithTitle, WithHeadings
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
            'Seven Day Old Date',
            'Total Clicks',
            'Total Impressions'
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Console Clicks Impressions Days Annotations';
    }
}
