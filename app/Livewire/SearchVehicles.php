<?php

namespace App\Livewire;

use App\Models\Vehicle;
use App\Models\Category;
use Livewire\Component;

class SearchVehicles extends Component
{
    public $query = '';
    public $results = [];
    public $matchedCategories = [];

    public function updatedQuery()
    {
        if (strlen($this->query) < 2) {
            $this->results = [];
            $this->matchedCategories = [];
            return;
        }

        // Search Categories (Smart Search)
        $this->matchedCategories = Category::where('name', 'like', '%' . $this->query . '%')
            ->limit(3)
            ->get();

        // Search Vehicles (Model, Brand, Year)
        $this->results = Vehicle::with('brand')
            ->where('model', 'like', '%' . $this->query . '%')
            ->orWhereHas('brand', function ($q) {
                $q->where('name', 'like', '%' . $this->query . '%');
            })
            ->orWhere('year', 'like', '%' . $this->query . '%')
            ->limit(3)
            ->get();
    }

    public function render()
    {
        return view('livewire.search-vehicles');
    }
}
