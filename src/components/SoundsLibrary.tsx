import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react";

interface Sound {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  benefits: string[];
  url: string; // In real app, this would be actual audio URLs
}

const vedicSounds: Sound[] = [
  {
    id: '1',
    title: 'Om Chanting',
    description: 'Sacred Om vibrations for deep meditation and spiritual awakening',
    category: 'Mantras',
    duration: '10:00',
    benefits: ['Stress Relief', 'Spiritual Connection', 'Mental Clarity'],
    url: '#'
  },
  {
    id: '2',
    title: 'Gayatri Mantra',
    description: 'Ancient Vedic hymn for wisdom and enlightenment',
    category: 'Mantras',
    duration: '8:30',
    benefits: ['Wisdom', 'Protection', 'Spiritual Growth'],
    url: '#'
  },
  {
    id: '3',
    title: 'Tibetan Singing Bowls',
    description: 'Healing frequencies from traditional Tibetan bowls',
    category: 'Healing Sounds',
    duration: '15:00',
    benefits: ['Deep Relaxation', 'Chakra Balancing', 'Sound Healing'],
    url: '#'
  },
  {
    id: '4',
    title: 'Forest Meditation',
    description: 'Natural forest sounds combined with gentle mantras',
    category: 'Nature',
    duration: '12:00',
    benefits: ['Grounding', 'Peace', 'Nature Connection'],
    url: '#'
  },
  {
    id: '5',
    title: 'Pranayama Guide',
    description: 'Guided breathing exercises with traditional sounds',
    category: 'Breathing',
    duration: '6:45',
    benefits: ['Breath Control', 'Energy Balance', 'Calm Mind'],
    url: '#'
  },
  {
    id: '6',
    title: 'Chakra Healing Frequencies',
    description: 'Seven chakra tones for energy center alignment',
    category: 'Healing Sounds',
    duration: '21:00',
    benefits: ['Energy Alignment', 'Healing', 'Balance'],
    url: '#'
  }
];

const SoundsLibrary: React.FC = () => {
  const [sounds] = useState<Sound[]>(vedicSounds);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const audioRef = useRef<HTMLAudioElement>(null);

  const categories = ['all', 'Mantras', 'Healing Sounds', 'Nature', 'Breathing'];

  const filteredSounds = selectedCategory === 'all' 
    ? sounds 
    : sounds.filter(sound => sound.category === selectedCategory);

  const playSound = (sound: Sound) => {
    setCurrentSound(sound);
    setIsPlaying(true);
    // In a real app, you would load and play the actual audio file
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
          Sounds of the Vedas
        </h2>
        <p className="text-muted-foreground text-lg">
          Sacred sounds and healing frequencies for your spiritual journey
        </p>
      </div>

      {/* Audio Player */}
      {currentSound && (
        <Card className="mandala-shadow sticky top-20 z-40 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h4 className="font-semibold sanskrit-title">{currentSound.title}</h4>
                <p className="text-sm text-muted-foreground">{currentSound.category}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button onClick={togglePlayPause} size="sm">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-20"
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Slider
                value={[currentTime]}
                onValueChange={(value) => setCurrentTime(value[0])}
                max={duration || 100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{currentSound.duration}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Sounds' : category}
          </Button>
        ))}
      </div>

      {/* Sounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSounds.map((sound) => (
          <Card key={sound.id} className="mandala-shadow transition-mystic hover:scale-105">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sanskrit-title">{sound.title}</CardTitle>
                <Badge variant="secondary">{sound.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{sound.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Benefits:</h5>
                <div className="flex flex-wrap gap-1">
                  {sound.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-muted-foreground">{sound.duration}</span>
                <Button 
                  onClick={() => playSound(sound)}
                  variant={currentSound?.id === sound.id ? "default" : "outline"}
                  className="transition-mystic"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {currentSound?.id === sound.id ? 'Playing' : 'Play'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meditation Tips */}
      <Card className="mandala-shadow">
        <CardHeader>
          <CardTitle className="sanskrit-title">Meditation Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium">Best Time to Listen</h5>
              <p className="text-sm text-muted-foreground">Early morning (4-6 AM) or evening (6-8 PM) for optimal benefits</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Listening Environment</h5>
              <p className="text-sm text-muted-foreground">Find a quiet, comfortable space where you won't be disturbed</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Posture</h5>
              <p className="text-sm text-muted-foreground">Sit upright with spine straight, or lie down comfortably</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Focus</h5>
              <p className="text-sm text-muted-foreground">Allow the sounds to wash over you without forcing concentration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoundsLibrary;