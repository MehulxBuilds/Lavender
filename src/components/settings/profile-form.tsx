"use client"

import { useGetUserProfile, useUpdateUserProfile } from '@/hooks/query/settings';
import { FormEvent, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

function ProfileFormFields({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
    const [name, setName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);

    const { mutate, isPending: isUpdatePending } = useUpdateUserProfile();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({ name, email });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type='text'
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isUpdatePending}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Email</Label>
                        <Input
                            id="email"
                            type='email'
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isUpdatePending}
                        />
                    </div>
                    <Button type='submit' disabled={isUpdatePending}>
                        {isUpdatePending ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

const ProfileForm = () => {
    const { data: profile, isPending } = useGetUserProfile();

    if (isPending) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='animate-pulse space-y-4'>
                        <div className='h-10 bg-muted rounded'></div>
                        <div className='h-10 bg-muted rounded'></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <ProfileFormFields
            key={profile?.id}
            initialName={profile?.name ?? ""}
            initialEmail={profile?.email ?? ""}
        />
    )
}

export default ProfileForm;