import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Plane,
  Heart,
  Calculator,
  Clock,
  Trash2,
  Settings,
  LogOut,
  Search,
  ArrowRight,
  Edit2,
  X,
  Check,
  Camera } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { DESTINATIONS } from '../utils/destinations';
export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, removeSavedSearch, updateUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  
  const handleSaveName = () => {
    if (editedName.trim() && editedName !== user?.name) {
      updateUser({ name: editedName.trim() });
    }
    setIsEditingName(false);
  };
  
  const handleSaveAvatar = () => {
    if (avatarUrl.trim() && avatarUrl !== user?.avatar) {
      updateUser({ avatar: avatarUrl.trim() });
    }
    setIsEditingAvatar(false);
  };
  
  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setAvatarUrl(user?.avatar || '');
    setIsEditingName(false);
    setIsEditingAvatar(false);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll create a data URL
      // In production, you'd upload to a server
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        updateUser({ avatar: result });
        setIsEditingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Not Logged In
          </h1>
          <p className="text-muted-foreground mb-6">
            Please log in to view your profile.
          </p>
          <Link to="/login">
            <Button variant="primary">Log In</Button>
          </Link>
        </div>
      </div>);

  }
  const favoriteDestinations = DESTINATIONS.filter((d) =>
  user.favoriteDestinations.includes(d.id)
  );
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 py-12">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              {user.avatar ?
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover" /> :


              <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              }
              <button
                onClick={() => setIsEditingAvatar(true)}
                className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                title="Edit profile picture"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-bold text-foreground bg-background border border-primary rounded px-2 py-1 flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 text-success hover:bg-success/10 rounded"
                    title="Save"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded"
                    title="Cancel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    {user.name}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                    title="Edit name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Settings className="w-4 h-4" />}>

                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
                className="text-destructive hover:text-destructive">

                Log out
              </Button>
            </div>
          </div>
        </div>
        
        {/* Avatar Edit Modal */}
        {isEditingAvatar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Edit Profile Picture</h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Or upload from device
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                
                {avatarUrl && (
                  <div className="flex justify-center">
                    <img
                      src={avatarUrl}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleSaveAvatar}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Saved Searches */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Search className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Saved Searches
                    </h2>
                  </div>
                  <Link to="/search">
                    <Button variant="outline" size="sm">
                      New Search
                    </Button>
                  </Link>
                </div>

                {user.savedSearches.length > 0 ?
                <div className="space-y-3">
                    {user.savedSearches.map((search) =>
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">

                        <div className="flex items-center gap-4">
                          <Plane className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              {search.origin} → {search.destination}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{search.departureDate}</span>
                              {search.returnDate &&
                          <>
                                  <span>-</span>
                                  <span>{search.returnDate}</span>
                                </>
                          }
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to="/search">
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedSearch(search.id)}
                        className="text-destructive hover:text-destructive">

                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                  )}
                  </div> :

                <p className="text-center text-muted-foreground py-8">
                    No saved searches yet. Start searching for flights!
                  </p>
                }
              </div>

              {/* Trip History */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Trip History
                  </h2>
                </div>

                {user.tripHistory.length > 0 ?
                <div className="space-y-3">
                    {user.tripHistory.map((trip) =>
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">

                        <div className="flex items-center gap-4">
                          <div
                        className={`
                            p-2 rounded-lg
                            ${trip.status === 'completed' ? 'bg-success/10' : trip.status === 'upcoming' ? 'bg-primary/10' : 'bg-destructive/10'}
                          `}>

                            <Plane
                          className={`
                              w-5 h-5
                              ${trip.status === 'completed' ? 'text-success' : trip.status === 'upcoming' ? 'text-primary' : 'text-destructive'}
                            `} />

                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {trip.origin} → {trip.destination}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{trip.airline}</span>
                              <span>•</span>
                              <span>{trip.departureDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ${trip.price}
                          </p>
                          <span
                        className={`
                            text-xs font-medium px-2 py-1 rounded-full
                            ${trip.status === 'completed' ? 'bg-success/10 text-success' : trip.status === 'upcoming' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}
                          `}>

                            {trip.status.charAt(0).toUpperCase() +
                        trip.status.slice(1)}
                          </span>
                        </div>
                      </div>
                  )}
                  </div> :

                <p className="text-center text-muted-foreground py-8">
                    No trip history yet.
                  </p>
                }
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Favorite Destinations */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <Heart className="w-5 h-5 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Favorite Destinations
                  </h3>
                </div>

                {favoriteDestinations.length > 0 ?
                <div className="space-y-3">
                    {favoriteDestinations.map((dest) =>
                  <Link
                    key={dest.id}
                    to={`/destinations/${dest.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">

                        <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-12 h-12 rounded-lg object-cover" />

                        <div>
                          <p className="font-medium text-foreground">
                            {dest.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {dest.country}
                          </p>
                        </div>
                      </Link>
                  )}
                  </div> :

                <p className="text-sm text-muted-foreground">
                    No favorite destinations yet. Explore and save places you
                    love!
                  </p>
                }

                <Link to="/destinations" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Destinations
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trips taken</span>
                    <span className="font-semibold text-foreground">
                      {
                      user.tripHistory.filter((t) => t.status === 'completed').
                      length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Upcoming trips
                    </span>
                    <span className="font-semibold text-foreground">
                      {
                      user.tripHistory.filter((t) => t.status === 'upcoming').
                      length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Saved searches
                    </span>
                    <span className="font-semibold text-foreground">
                      {user.savedSearches.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Favorite places
                    </span>
                    <span className="font-semibold text-foreground">
                      {user.favoriteDestinations.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>);

}