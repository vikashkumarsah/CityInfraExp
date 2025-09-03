import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/useToast';
import { seedAdminUser, seedRegularUsers, seedInfrastructureData } from '../api/seed';
import { Loader2, Database, Users, UserCheck } from 'lucide-react';

export const SeedData = () => {
  const [loading, setLoading] = useState({
    admin: false,
    users: false,
    infrastructure: false,
  });
  const { toast } = useToast();

  const handleSeedAdmin = async () => {
    setLoading(prev => ({ ...prev, admin: true }));
    try {
      const result = await seedAdminUser();
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, admin: false }));
    }
  };

  const handleSeedUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const result = await seedRegularUsers();
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const handleSeedInfrastructure = async () => {
    setLoading(prev => ({ ...prev, infrastructure: true }));
    try {
      const result = await seedInfrastructureData();
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, infrastructure: false }));
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Database Seeding</h1>
        <p className="text-muted-foreground mt-2">
          Initialize the database with sample data for development and testing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Admin User
            </CardTitle>
            <CardDescription>
              Create the initial admin user account for system administration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSeedAdmin} 
              disabled={loading.admin}
              className="w-full"
            >
              {loading.admin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Seed Admin User
            </Button>
            <div className="mt-4 text-sm text-muted-foreground">
              <p><strong>Email:</strong> admin@infracity.com</p>
              <p><strong>Password:</strong> Admin123!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Regular Users
            </CardTitle>
            <CardDescription>
              Create sample user accounts for different roles and departments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSeedUsers} 
              disabled={loading.users}
              className="w-full"
            >
              {loading.users && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Seed Regular Users
            </Button>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Creates 4 users:</p>
              <p>• City Planner</p>
              <p>• Traffic Engineer</p>
              <p>• Maintenance Crew</p>
              <p>• Viewer</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Infrastructure Data
            </CardTitle>
            <CardDescription>
              Populate the database with sample roads, intersections, and issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSeedInfrastructure} 
              disabled={loading.infrastructure}
              className="w-full"
            >
              {loading.infrastructure && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Seed Infrastructure
            </Button>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Creates:</p>
              <p>• 4 Road segments</p>
              <p>• 3 Intersections</p>
              <p>• 4 Infrastructure issues</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>1. <strong>Seed Admin User:</strong> Creates the main administrator account</p>
          <p>2. <strong>Seed Regular Users:</strong> Creates sample users with different roles</p>
          <p>3. <strong>Seed Infrastructure:</strong> Populates the database with sample infrastructure data</p>
          <p className="text-sm text-muted-foreground mt-4">
            Note: Infrastructure seeding will clear existing data and replace it with sample data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};