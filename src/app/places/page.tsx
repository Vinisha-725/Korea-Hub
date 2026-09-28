import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PlacesPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Saved Places</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add place
        </Button>
      </div>
      <div className="text-center py-16 text-muted-foreground">
        <p>Coming soon</p>
      </div>
    </div>
  );
}
