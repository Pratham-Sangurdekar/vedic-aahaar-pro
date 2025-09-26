import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Users, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface CommunityPost {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: string;
  isLiked: boolean;
}

const samplePosts: CommunityPost[] = [
  {
    id: '1',
    content: 'Started my Ayurvedic journey 3 months ago and feeling amazing! The diet changes have really helped with my energy levels. Anyone else experienced similar improvements?',
    author: 'Priya S.',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    category: 'Success Story',
    isLiked: false
  },
  {
    id: '2',
    content: 'Can someone recommend good yoga poses for better digestion? I\'ve been having some issues lately and would love natural solutions.',
    author: 'Raj M.',
    timestamp: '4 hours ago',
    likes: 12,
    comments: 15,
    category: 'Question',
    isLiked: true
  },
  {
    id: '3',
    content: 'Just finished a 7-day detox program with triphala and feel incredibly refreshed! The difference in my skin clarity is remarkable. Highly recommend!',
    author: 'Anita K.',
    timestamp: '1 day ago',
    likes: 45,
    comments: 22,
    category: 'Experience',
    isLiked: false
  },
  {
    id: '4',
    content: 'Weekly meditation group meeting tomorrow at 6 PM. We\'ll be focusing on stress management techniques. New members welcome!',
    author: 'Wellness Circle',
    timestamp: '1 day ago',
    likes: 18,
    comments: 6,
    category: 'Event',
    isLiked: false
  }
];

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>(samplePosts);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Question', 'Success Story', 'Experience', 'Event', 'Recipe Share'];

  const handleLike = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handlePost = () => {
    if (!newPost.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      content: newPost,
      author: user?.email?.split('@')[0] || 'Anonymous',
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      category: 'General',
      isLiked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    
    toast({
      title: "Post shared!",
      description: "Your post has been shared with the community.",
    });
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
          Wellness Community
        </h2>
        <p className="text-muted-foreground text-lg">
          Connect, share, and support each other on your wellness journey
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="mandala-shadow">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card className="mandala-shadow">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">856</div>
            <div className="text-sm text-muted-foreground">Posts This Week</div>
          </CardContent>
        </Card>
        <Card className="mandala-shadow">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">94%</div>
            <div className="text-sm text-muted-foreground">Positive Feedback</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Post */}
      <Card className="mandala-shadow">
        <CardHeader>
          <CardTitle className="sanskrit-title">Share with Community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your wellness journey, ask questions, or offer support..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {categories.slice(1).map(category => (
                <Badge key={category} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {category}
                </Badge>
              ))}
            </div>
            <Button onClick={handlePost} disabled={!newPost.trim()}>
              Share Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Posts' : category}
          </Button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="mandala-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {post.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold sanskrit-title">{post.author}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.timestamp}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">{post.content}</p>
                  
                  <div className="flex items-center space-x-6 pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLike(post.id)}
                      className={`text-muted-foreground hover:text-primary ${post.isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;