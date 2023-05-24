<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class AnalyticFullExport implements WithMultipleSheets
{
    use Exportable;

    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];
        $sheets['Anayltic Top Statistics'] = new AnalyticTopStatisticsExport($this->data['topStatisticsIndex']);
        $sheets['Users Days Annotations'] = new AnalyticUsersDaysAnnotationsExport($this->data['usersDaysAnnotationsIndex']['statistics']);
        $sheets['Annotations Metrics Dimension'] = new AnalyticAnnotationsMetricsDimensionExport($this->data['annotationsMetricsDimensionsIndex']['annotations']);
        $sheets['Media'] = new AnalyticMediaExport($this->data['mediaIndex']['statistics']);
        $sheets['Sources'] = new AnalyticSourcesExport($this->data['sourcesIndex']['statistics']);
        $sheets['Device Categories'] = new AnalyticdeviceCategoriesExport($this->data['deviceCategoriesIndex']['statistics']);
        $sheets['Device By Impression'] = new AnalyticdeviceByImpressionExport($this->data['devicesIndexByImpression']['statistics']);
        $sheets['Countries'] = new AnalyticCountriesExport($this->data['countriesIndex']['statistics']);
        $sheets['Console Top Statistics'] = new ConsoleTopStatisticsExport($this->data['consoletopStatisticsIndex']['statistics']);
        $sheets['Console Clicks Impressions Days Annotations'] = new ConsoleclicksImpressionsDaysAnnotationsExport($this->data['clicksImpressionsDaysAnnotationsIndex']['statistics']);
        $sheets['Console Annotations Dates'] = new ConsoleAnnotationsDatesIndexExport($this->data['annotationsDatesIndex']['annotations']);
        $sheets['Console Queries'] = new ConsoleQueriesIndexExport($this->data['queriesIndex']['statistics']);
        $sheets['Console Pages'] = new ConsolePagesIndexExport($this->data['pagesIndex']['statistics']);
        return $sheets;
    }

}
