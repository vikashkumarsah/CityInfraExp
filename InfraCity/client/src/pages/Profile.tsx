import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/useToast"
import { getUserProfile, updateUserProfile } from "@/api/users"
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  Edit,
  Save,
  X
} from "lucide-react"

type ProfileForm = {
  firstName: string
  lastName: string
  department: string
  phone: string
}

type UserProfile = {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
  department: string
  phone: string
  createdAt: string
  lastLoginAt: string
  isActive: boolean
}

const roleLabels: Record<string, string> = {
  'admin': 'Administrator',
  'city_planner': 'City Planner',
  'traffic_engineer': 'Traffic Engineer',
  'maintenance_crew': 'Maintenance Crew',
  'viewer': 'Viewer'
};

export function Profile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const { toast } = useToast()
  const { register, handleSubmit, reset } = useForm<ProfileForm>()

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await getUserProfile()
      if (response.success) {
        setProfile(response.data)
        reset({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          department: response.data.department || '',
          phone: response.data.phone || ''
        })
      }
    } catch (error) {
      console.error("Profile fetch error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to load profile",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ProfileForm) => {
    try {
      setSaving(true)
      const response = await updateUserProfile(data)
      if (response.success) {
        setProfile(response.data)
        setEditing(false)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to update profile",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        department: profile.department || '',
        phone: profile.phone || ''
      })
    }
    setEditing(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
          <Button onClick={fetchProfile} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your account details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName", { required: true })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Your department"
                  {...register("department")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  {...register("phone")}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                  <p className="text-sm font-medium">{profile.firstName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                  <p className="text-sm font-medium">{profile.lastName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {roleLabels[profile.role] || profile.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {profile.department && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                    <p className="text-sm font-medium">{profile.department}</p>
                  </div>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-sm font-medium">{profile.phone}</p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                  <p className="text-sm font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                  <p className="text-sm font-medium">
                    {new Date(profile.lastLoginAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}