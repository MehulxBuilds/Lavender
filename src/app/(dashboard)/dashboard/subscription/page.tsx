"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Loader2, ExternalLink, RefreshCw } from "lucide-react"

import { checkout, customer } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { usePayments } from "@/hooks/query/payments"
import { Spinner } from "@/components/ui/spinner"

const PLAN_FEATURES = {
  free: [
    { name: "Up to 5 repositories", included: true },
    { name: "Up to 5 reviews per repository", included: true },
    { name: "Basic code reviews", included: true },
    { name: "Community support", included: true },
    { name: "Advanced analytics", included: false },
    { name: "Priority support", included: false },
  ],
  pro: [
    { name: "Unlimited repositories", included: true },
    { name: "Unlimited reviews", included: true },
    { name: "Advanced code reviews", included: true },
    { name: "Email support", included: true },
    { name: "Advanced analytics", included: true },
    { name: "Priority support", included: true },
  ],
}

const SubscriptionPage = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const searchParams = useSearchParams()
  const success = searchParams.get("success")

  const { data, isPending, isError, refetch } = usePayments();

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-4">
          <Spinner />
        </div>
      </div>
    )
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">Failed to load subscription data</p>
        </div>

        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load subscription data. Please try again.
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  };

  if (!data?.user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Please sign in to view subscription options
          </p>
        </div>
      </div>
    )
  };

  const currentTier = data.user.subscriptionTier as "FREE" | "PRO";
  const isPro = currentTier === "PRO";
  const isActive = data.user.subscriptionStatus === "ACTIVE";

  const handleSync = () => { }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
        </div>

        <Button variant="outline" size="sm" onClick={handleSync} disabled={syncLoading}>
          {syncLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Sync Status
        </Button>
      </div>

      {success === "true" && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your subscription has been updated successfully. Changes may take a few moments to reflect.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Usage */}
      {data.limits && (
        <Card>
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
            <CardDescription>Your current plan limits and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Repositories</span>
                  <Badge variant={data.limits.repositories.canAdd ? "default" : "destructive"}>
                    {data.limits.repositories.current} / {data.limits.repositories.limit ?? "∞"}
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${data.limits.repositories.canAdd ? "bg-primary" : "bg-destructive"}`}
                    style={{
                      width: data.limits.repositories.limit
                        ? `${Math.min(
                          (data.limits.repositories.current / data.limits.repositories.limit) * 100,
                          100
                        )}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reviews per Repository</span>
                  <Badge variant="outline">
                    {isPro ? "Unlimited" : "5 per repo"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isPro
                    ? "No limits on reviews"
                    : "Free tier allows 5 reviews per repository"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      

    </div>
  )

}

export default SubscriptionPage;