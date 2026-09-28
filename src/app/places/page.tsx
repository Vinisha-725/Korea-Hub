'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Place {
  id: string;
  name: string;
  address: string;
  notes: string;
  rating: number;
  created_at: string;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [newPlace, setNewPlace] = useState({ name: '', address: '', notes: '', rating: 5 });

  const addPlace = () => {
    if (!newPlace.name.trim()) return;
    const place: Place = {
      id: Date.now().toString(),
      ...newPlace,
      created_at: new Date().toISOString(),
    };
    setPlaces([...places, place]);
    localStorage.setItem('korea-places', JSON.stringify([...places, place]));
    setNewPlace({ name: '', address: '', notes: '', rating: 5 });
    setAddOpen(false);
  };

  const deletePlace = (id: string) => {
    const updated = places.filter((p) => p.id !== id);
    setPlaces(updated);
    localStorage.setItem('korea-places', JSON.stringify(updated));
  };

  useEffect(() => {
    const saved = localStorage.getItem('korea-places');
    if (saved) setPlaces(JSON.parse(saved));
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Saved Places</h1>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add place
        </Button>
      </div>

      {places.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No places saved yet</p>
            <p className="text-sm mt-2">Save your favorite places in Korea</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <Card key={place.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{place.name}</h3>
                    {place.address && (
                      <p className="text-sm text-muted-foreground">{place.address}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePlace(place.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                {place.notes && (
                  <p className="text-sm text-muted-foreground mt-2">{place.notes}</p>
                )}
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= place.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Place</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newPlace.name}
              onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
              placeholder="Place name"
            />
            <Input
              value={newPlace.address}
              onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
              placeholder="Address (optional)"
            />
            <Input
              value={newPlace.notes}
              onChange={(e) => setNewPlace({ ...newPlace, notes: e.target.value })}
              placeholder="Notes (optional)"
            />
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewPlace({ ...newPlace, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newPlace.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addPlace}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
