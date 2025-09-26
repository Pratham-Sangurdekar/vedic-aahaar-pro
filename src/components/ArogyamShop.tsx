import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Star, Filter, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  benefits: string[];
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Ashwagandha Capsules',
    description: 'Premium quality Ashwagandha for stress relief and vitality',
    price: 899,
    rating: 4.8,
    category: 'Herbs',
    image: '🌿',
    benefits: ['Stress Relief', 'Energy Boost', 'Immunity']
  },
  {
    id: '2',
    name: 'Triphala Powder',
    description: 'Traditional digestive support blend of three fruits',
    price: 649,
    rating: 4.6,
    category: 'Digestive',
    image: '🍃',
    benefits: ['Digestion', 'Detox', 'Antioxidant']
  },
  {
    id: '3',
    name: 'Brahmi Oil',
    description: 'Pure Brahmi oil for hair and scalp nourishment',
    price: 399,
    rating: 4.7,
    category: 'Oils',
    image: '🧴',
    benefits: ['Hair Growth', 'Stress Relief', 'Memory']
  },
  {
    id: '4',
    name: 'Turmeric Tablets',
    description: 'High curcumin content turmeric for inflammation support',
    price: 749,
    rating: 4.9,
    category: 'Herbs',
    image: '🧡',
    benefits: ['Anti-inflammatory', 'Joint Health', 'Immunity']
  },
  {
    id: '5',
    name: 'Chyawanprash',
    description: 'Traditional immunity booster with 40+ herbs',
    price: 1299,
    rating: 4.5,
    category: 'Immunity',
    image: '🍯',
    benefits: ['Immunity', 'Energy', 'Longevity']
  },
  {
    id: '6',
    name: 'Neem Capsules',
    description: 'Pure neem extract for skin and blood purification',
    price: 599,
    rating: 4.4,
    category: 'Skin Care',
    image: '🌱',
    benefits: ['Blood Purification', 'Skin Health', 'Detox']
  }
];

const ArogyamShop: React.FC = () => {
  const [products] = useState<Product[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const categories = ['all', 'Herbs', 'Digestive', 'Oils', 'Immunity', 'Skin Care'];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (search: string, category: string) => {
    let filtered = products;
    
    if (search) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    setFilteredProducts(filtered);
  };

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold sanskrit-title gradient-text mb-4">
          Arogyam Marketplace
        </h2>
        <p className="text-muted-foreground text-lg">
          Authentic Ayurvedic products for your wellness journey
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="relative">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            {getTotalItems() > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="mandala-shadow transition-mystic hover:scale-105">
            <CardHeader>
              <div className="text-6xl text-center mb-4">{product.image}</div>
              <CardTitle className="text-lg sanskrit-title">{product.name}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm">{product.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{product.description}</p>
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Key Benefits:</h5>
                <div className="flex flex-wrap gap-1">
                  {product.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="text-2xl font-bold text-primary">
                  ₹{product.price}
                </div>
                <Button 
                  onClick={() => addToCart(product.id)}
                  className="transition-mystic"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
              
              {cart[product.id] && (
                <div className="text-center text-sm text-green-600">
                  ✓ {cart[product.id]} item(s) in cart
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ArogyamShop;