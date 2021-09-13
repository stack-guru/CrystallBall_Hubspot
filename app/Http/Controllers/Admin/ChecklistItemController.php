<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\controllers\Controller;
use App\Http\Requests\ChecklistItemRequest;
use App\Models\ChecklistItem;

class ChecklistItemController extends Controller
{
    public function index()
    {
        return view('admin/checklist-item/index')->with('checklistItems', ChecklistItem::all());
    }

    public function create()
    {
        return view('admin/checklist-item/create');
    }

    public function store(ChecklistItemRequest $request)
    {
        $checklistItem = new ChecklistItem;
        $checklistItem->fill($request->validated());
        $checklistItem->save();

        return redirect()->back()->with('success', true);
    }

    public function edit(ChecklistItem $checklistItem)
    {
        return view('admin/checklist-item/edit')->with('checklistItem', $checklistItem);
    }

    public function update(ChecklistItemRequest $request, ChecklistItem $checklistItem)
    {
        $checklistItem->fill($request->validated());
        $checklistItem->save();

        return redirect()->back()->with('success', true);
    }

    public function destroy(ChecklistItem $checklistItem)
    {
        $checklistItem->delete();

        return redirect()->back()->with('success', true);
    }
}
