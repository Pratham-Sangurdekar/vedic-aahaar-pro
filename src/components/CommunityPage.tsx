import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Users, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CommunityPost {
  id: string;
  content: string;
  author: string;
  authorPic?: string | null;
  timestamp: string;
  category: string;
  likes: number;
  isLiked: boolean;
}

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [activeMembers, setActiveMembers] = useState<number | null>(null);
  const [postsThisWeek, setPostsThisWeek] = useState<number | null>(null);
  const [positiveFeedback, setPositiveFeedback] = useState<number | null>(null);
  const categories = ['all', 'Question', 'Success Story', 'Experience', 'Event', 'Recipe Share', 'General'];

  // Fetch posts from Supabase (patient_posts only)
  useEffect(() => {
    const fetchStatsAndPosts = async () => {
      setLoading(true);
      // Fetch patient posts with patient info
      const { data: patientPosts } = await supabase
        .from('patient_posts')
        .select('id, content, created_at, patient_id, patients(name, profile_pic_url)');
      // Fetch likes for current user
      let likesData: any[] = [];
      if (user?.role === 'patient' && user?.id) {
        const { data: likes } = await supabase
          .from('patient_post_likes')
          .select('post_id')
          .eq('patient_id', user.id);
        likesData = likes || [];
      }
      // Fetch like counts for all posts
      const { data: allLikes } = await supabase
        .from('patient_post_likes')
        .select('post_id');
      const likeCountMap: Record<string, number> = {};
      (allLikes || []).forEach((like: any) => {
        likeCountMap[like.post_id] = (likeCountMap[like.post_id] || 0) + 1;
      });
      const likedPostIds = new Set((likesData || []).map(l => l.post_id));
      const mappedPatientPosts: CommunityPost[] = (patientPosts || []).map((p: any) => ({
        id: p.id,
        content: p.content,
        author: p.patients?.name || 'Patient',
        authorPic: p.patients?.profile_pic_url || null,
        timestamp: p.created_at,
        category: 'General',
        likes: likeCountMap[p.id] || 0,
        isLiked: likedPostIds.has(p.id),
      }));
      setPosts(mappedPatientPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

      // Active Members: count patients only
      const { count: patientCount } = await supabase.from('patients').select('id', { count: 'exact', head: true });
      setActiveMembers(patientCount || 0);

      // Posts This Week: count patient_posts in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: postsCount } = await supabase
        .from('patient_posts')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());
      setPostsThisWeek(postsCount || 0);

      // Positive Feedback: placeholder (since no feedback table)
      setPositiveFeedback(94); // static for now

      setLoading(false);
    };
    fetchStatsAndPosts();
  }, [user]);

  // Post to Supabase (patients only)
  const handlePost = async () => {
    if (!newPost.trim()) return;
    if (user?.role === 'patient' && user?.id) {
      const { error } = await supabase.from('patient_posts').insert([{ content: newPost, patient_id: user.id }]);
      if (error) {
        toast({ title: 'Error', description: error.message });
      } else {
        setNewPost('');
        toast({ title: 'Post shared!', description: 'Your post has been shared with the community.' });
        setTimeout(() => window.location.reload(), 500);
      }
    } else {
      toast({ title: 'Error', description: 'You must be logged in as a patient to post.' });
    }
  };

  // Like/unlike post
  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user?.id || user?.role !== 'patient') {
      toast({ title: 'Error', description: 'You must be logged in as a patient to like posts.' });
      return;
    }
    if (isLiked) {
      // Unlike
      await supabase.from('patient_post_likes').delete().eq('post_id', postId).eq('patient_id', user.id);
    } else {
      // Like
      await supabase.from('patient_post_likes').insert([{ post_id: postId, patient_id: user.id }]);
    }
    // Refresh posts
    setTimeout(() => window.location.reload(), 300);
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
            <div className="text-2xl font-bold">{activeMembers !== null ? activeMembers : '...'}</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card className="mandala-shadow">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{postsThisWeek !== null ? postsThisWeek : '...'}</div>
            <div className="text-sm text-muted-foreground">Posts This Week</div>
          </CardContent>
        </Card>
        <Card className="mandala-shadow">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{positiveFeedback !== null ? `${positiveFeedback}%` : '...'}</div>
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
                  {post.authorPic ? (
                    <img src={post.authorPic} alt={post.author} className="rounded-full w-10 h-10" />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {post.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
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
                      {new Date(post.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{post.content}</p>
                  <div className="flex items-center space-x-6 pt-2">
                    <Button
                      variant={post.isLiked ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleLike(post.id, post.isLiked)}
                      className={`text-muted-foreground hover:text-primary ${post.isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
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