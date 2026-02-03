"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, Building, Settings as SettingsIcon, Moon, Sun, LogOut } from "lucide-react";
import { useGigFin } from "@/context/GigFinContext";
import { useAuth } from "@/context/AuthContext";
import { BackendStatus } from "@/components/dashboard/BackendStatus";

export function SettingsPage() {
    const { userProfile, updateUserProfile, toggleTheme } = useGigFin();
    const { logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Local state for form to handle edits before saving
    const [formData, setFormData] = useState({
        name: userProfile.name,
        age: userProfile.age,
        email: userProfile.email,
        location: userProfile.location,
        occupation: userProfile.occupation,
        accountNo: userProfile.bankDetails.accountNo,
        ifsc: userProfile.bankDetails.ifsc,
        bankName: userProfile.bankDetails.bankName
    });

    const handleSave = () => {
        updateUserProfile({
            name: formData.name,
            age: Number(formData.age),
            email: formData.email,
            location: formData.location,
            occupation: formData.occupation,
            bankDetails: {
                accountNo: formData.accountNo,
                ifsc: formData.ifsc,
                bankName: formData.bankName
            }
        });
        setIsEditing(false);
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <SettingsIcon className="h-8 w-8" />
                Settings
            </h2>

            {/* Profile Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Profile & Personal Details</CardTitle>
                        <CardDescription>Manage your personal information</CardDescription>
                    </div>
                    <Button variant={isEditing ? "default" : "outline"} onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                        {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Age</Label>
                            <Input
                                type="number"
                                value={formData.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Occupation</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={formData.occupation}
                                    onChange={(e) => handleChange('occupation', e.target.value)}
                                    disabled={!isEditing}
                                />
                                <Badge variant="secondary" className="whitespace-nowrap">Gig Worker</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bank Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Bank Details
                    </CardTitle>
                    <CardDescription>Your linked bank account for withdrawals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Bank Name</Label>
                            <Input
                                value={formData.bankName}
                                onChange={(e) => handleChange('bankName', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Account Number</Label>
                            <div className="relative">
                                <Input
                                    value={formData.accountNo}
                                    onChange={(e) => handleChange('accountNo', e.target.value)}
                                    disabled={!isEditing}
                                />
                                {!isEditing && (
                                    <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>IFSC Code</Label>
                            <Input
                                value={formData.ifsc}
                                onChange={(e) => handleChange('ifsc', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="flex items-end">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 flex gap-1 items-center">
                                <CheckCircle className="h-3 w-3" />
                                KYC Verified
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* App Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <BackendStatus />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Switch between light and dark themes
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-muted-foreground" />
                            <Switch
                                checked={userProfile.theme === 'dark'}
                                onCheckedChange={toggleTheme}
                            />
                            <Moon className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Language</Label>
                            <p className="text-sm text-muted-foreground">
                                Select your preferred language
                            </p>
                        </div>
                        <Select defaultValue="en">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">Hindi</SelectItem>
                                <SelectItem value="te">Telugu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Button
                variant="destructive"
                className="w-full py-6 text-lg font-bold bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900"
                onClick={logout}
            >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
            </Button>
        </div>
    );
}
