import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer, User, Zap, Heart, Brain, ArrowRight, CheckCircle } from "lucide-react";
import child from "/src/assets/child.png";
import dog from "/src/assets/dog.png";
import mountain from "/src/assets/mountain.png";
import warrior from "/src/assets/warrior.png";

interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  benefits: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  steps: string[];
  precautions: string[];
  image: string; // Emoji for now, would be actual images in real app
}

interface YogaSequence {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits: string[];
  poses: string[]; // pose IDs
}

const yogaPoses: YogaPose[] = [
  {
    id: '1',
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    description: 'The foundation of all standing poses, promoting balance and grounding',
    benefits: ['Improves posture', 'Strengthens legs', 'Enhances balance', 'Reduces anxiety'],
    difficulty: 'Beginner',
    duration: '1-2 minutes',
    steps: [
      'Stand with feet hip-width apart',
      'Ground through all four corners of feet',
      'Engage leg muscles and lift kneecaps',
      'Lengthen spine and crown of head toward ceiling',
      'Relax shoulders away from ears',
      'Breathe deeply and hold'
    ],
    precautions: ['Avoid if experiencing severe balance issues'],
    image: mountain
  },
  {
    id: '2',
    name: 'Downward Facing Dog',
    sanskritName: 'Adho Mukha Svanasana',
    description: 'An invigorating pose that stretches and strengthens the entire body',
    benefits: ['Strengthens arms and legs', 'Stretches spine', 'Energizes body', 'Calms mind'],
    difficulty: 'Beginner',
    duration: '1-3 minutes',
    steps: [
      'Start on hands and knees',
      'Tuck toes under and lift hips up and back',
      'Straighten legs as much as comfortable',
      'Press hands firmly into mat',
      'Create inverted V shape with body',
      'Breathe steadily'
    ],
    precautions: ['Avoid with wrist or shoulder injuries', 'Modify if pregnant'],
    image: dog
  },
  {
    id: '3',
    name: 'Child\'s Pose',
    sanskritName: 'Balasana',
    description: 'A restorative pose that promotes relaxation and introspection',
    benefits: ['Relieves stress', 'Stretches back', 'Calms nervous system', 'Reduces fatigue'],
    difficulty: 'Beginner',
    duration: '1-5 minutes',
    steps: [
      'Kneel on floor with big toes touching',
      'Sit back on heels',
      'Open knees hip-width apart',
      'Fold forward, extending arms in front',
      'Rest forehead on mat',
      'Breathe deeply and relax'
    ],
    precautions: ['Avoid if pregnant (modify with wide knees)', 'Use props if knees are sensitive'],
    image: child
  },
  {
    id: '4',
    name: 'Warrior I',
    sanskritName: 'Virabhadrasana I',
    description: 'A powerful standing pose that builds strength and confidence',
    benefits: ['Strengthens legs', 'Opens chest and shoulders', 'Improves balance', 'Builds confidence'],
    difficulty: 'Intermediate',
    duration: '30 seconds - 1 minute per side',
    steps: [
      'Step left foot back 3-4 feet',
      'Turn left foot out 45 degrees',
      'Bend right knee over ankle',
      'Square hips toward front',
      'Reach arms overhead',
      'Hold and repeat on other side'
    ],
    precautions: ['Avoid with knee injuries', 'Modify if pregnant'],
    image: warrior
  }
];

const yogaSequences: YogaSequence[] = [
  {
    id: '1',
    title: 'Morning Energizer',
    description: 'A gentle sequence to awaken the body and mind',
    duration: '15 minutes',
    difficulty: 'Beginner',
    benefits: ['Increases energy', 'Improves circulation', 'Mental clarity'],
    poses: ['1', '2', '3']
  },
  {
    id: '2',
    title: 'Stress Relief Flow',
    description: 'Calming poses to release tension and promote relaxation',
    duration: '20 minutes',
    difficulty: 'Beginner',
    benefits: ['Reduces stress', 'Promotes relaxation', 'Better sleep'],
    poses: ['3', '1', '2']
  },
  {
    id: '3',
    title: 'Strength Builder',
    description: 'Build physical and mental strength with warrior poses',
    duration: '25 minutes',
    difficulty: 'Intermediate',
    benefits: ['Builds strength', 'Improves balance', 'Increases confidence'],
    poses: ['1', '4', '2', '3']
  }
];

const YogaModule: React.FC = () => {
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [activeSequence, setActiveSequence] = useState<YogaSequence | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInSession, setIsInSession] = useState(false);
  const [completedPoses, setCompletedPoses] = useState<Set<string>>(new Set());

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const startSequence = (sequence: YogaSequence) => {
    setActiveSequence(sequence);
    setIsInSession(true);
    setCurrentStep(0);
    const firstPose = yogaPoses.find(p => p.id === sequence.poses[0]);
    setSelectedPose(firstPose || null);
  };

  const nextPose = () => {
    if (!activeSequence) return;
    
    if (selectedPose) {
      setCompletedPoses(prev => new Set([...prev, selectedPose.id]));
    }
    
    const nextIndex = currentStep + 1;
    if (nextIndex < activeSequence.poses.length) {
      setCurrentStep(nextIndex);
      const nextPose = yogaPoses.find(p => p.id === activeSequence.poses[nextIndex]);
      setSelectedPose(nextPose || null);
    } else {
      // Sequence completed
      setIsInSession(false);
      setActiveSequence(null);
      setSelectedPose(null);
      setCurrentStep(0);
    }
  };

  const endSession = () => {
    setIsInSession(false);
    setActiveSequence(null);
    setSelectedPose(null);
    setCurrentStep(0);
  };

  if (isInSession && activeSequence && selectedPose) {
    return (
      <div className="space-y-6">
        {/* Session Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold sanskrit-title gradient-text mb-2">
            {activeSequence.title}
          </h2>
          <Progress 
            value={(currentStep / activeSequence.poses.length) * 100} 
            className="w-full max-w-md mx-auto"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Pose {currentStep + 1} of {activeSequence.poses.length}
          </p>
        </div>

        {/* Current Pose */}
        <Card className="mandala-shadow max-w-4xl mx-auto">
          <CardHeader >
          <div className="image-container">
                <img src={selectedPose.image} alt={selectedPose.name} className="object-cover" />
              </div>
            <CardTitle >
              {selectedPose.name}
            </CardTitle>
            <p className="text-lg text-muted-foreground italic">
              {selectedPose.sanskritName}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              {selectedPose.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Step-by-Step Instructions:</h4>
                <ol className="space-y-2">
                  {selectedPose.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Benefits:</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedPose.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Duration:</h5>
                  <p className="text-sm text-muted-foreground">{selectedPose.duration}</p>
                </div>

                {selectedPose.precautions.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 text-amber-600">Precautions:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedPose.precautions.map((precaution, index) => (
                        <li key={index}>• {precaution}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-6">
              <Button variant="outline" onClick={endSession}>
                End Session
              </Button>
              <Button onClick={nextPose}>
                {currentStep + 1 === activeSequence.poses.length ? 'Complete' : 'Next Pose'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
          Yoga Sadhana
        </h2>
        <p className="text-muted-foreground text-lg">
          Traditional yoga practices for body, mind, and spirit
        </p>
      </div>

      {/* Yoga Sequences */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold sanskrit-title">Guided Sequences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {yogaSequences.map((sequence) => (
            <Card key={sequence.id} className="mandala-shadow transition-mystic hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sanskrit-title">{sequence.title}</CardTitle>
                  <Badge variant="secondary" className={getDifficultyColor(sequence.difficulty)}>
                    {sequence.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{sequence.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-1" />
                    {sequence.duration}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {sequence.poses.length} poses
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Benefits:</h5>
                  <div className="flex flex-wrap gap-1">
                    {sequence.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => startSequence(sequence)}
                  className="w-full transition-mystic"
                >
                  Start Practice
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Individual Poses */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold sanskrit-title">Pose Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {yogaPoses.map((pose) => (
            <Card 
              key={pose.id} 
              className={`mandala-shadow transition-mystic hover:scale-105 cursor-pointer ${
                completedPoses.has(pose.id) ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => setSelectedPose(pose)}
            >
              <CardHeader >
                <div className="image-container">
                <img src={pose.image} alt={pose.name} className="object-cover" />
              </div>
                <CardTitle className="text-sm sanskrit-title">{pose.name}</CardTitle>
                <p className="text-xs text-muted-foreground italic">{pose.sanskritName}</p>
                {completedPoses.has(pose.id) && (
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                )}
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className={getDifficultyColor(pose.difficulty)}>
                  {pose.difficulty}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Individual Pose Detail Modal */}
      {selectedPose && !isInSession && (
        <Card className="mandala-shadow max-w-4xl mx-auto">
          <CardHeader>
            <div className="image-container">
                <img src={selectedPose.image} alt={selectedPose.name} className="object-cover" />
              </div>
            <CardTitle className="text-2xl sanskrit-title">
              {selectedPose.name}
            </CardTitle>
            <p className="text-lg text-muted-foreground italic">
              {selectedPose.sanskritName}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              {selectedPose.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Instructions:</h4>
                <ol className="space-y-2">
                  {selectedPose.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Benefits:</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedPose.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Duration:</h5>
                  <p className="text-sm text-muted-foreground">{selectedPose.duration}</p>
                </div>

                {selectedPose.precautions.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 text-amber-600">Precautions:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedPose.precautions.map((precaution, index) => (
                        <li key={index}>• {precaution}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button onClick={() => setSelectedPose(null)} variant="outline">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YogaModule;