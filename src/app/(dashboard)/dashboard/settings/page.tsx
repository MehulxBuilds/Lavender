import RepositoryList from "@/components/repository/repository-list";
import ProfileForm from "@/components/settings/profile-form";

const Settings = () => {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and repositories</p>
                </div>

                <ProfileForm />
                <RepositoryList />
            </div>
        </div>
    )
}

export default Settings;