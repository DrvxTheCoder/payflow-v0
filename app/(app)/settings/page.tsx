import type { Metadata } from "next"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { CardTitle } from "@/components/card-title"
import { ThemeTogglerButton } from "@/components/vendor/animate-ui/components/buttons/theme-toggler"

export const metadata: Metadata = {
  title: "Payflow — Settings",
}

const CARD =
  "rounded-[2rem] bg-card p-6 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--sidebar-foreground)_6%,transparent)] ring-1 ring-sidebar-foreground/5"

export default function SettingsPage() {
  return (
    <div className="mx-2 pb-6 pt-3">
      <PageHeader
        title="Settings"
        description="Appearance and account preferences."
      />

      <div className="flex flex-col gap-4 px-2 md:px-3">
        <section className={CARD}>
          <CardTitle>Appearance</CardTitle>
          <p className="text-sm text-muted-foreground">
            How Payflow looks on this device.
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-sidebar-foreground/5 p-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">
                Cycles between light, dark and your system setting.
              </p>
            </div>
            <ThemeTogglerButton
              className="shrink-0 rounded-full cursor-pointer"
              direction="btt"
            />
          </div>
        </section>

        <section className={CARD}>
          <CardTitle>Profile</CardTitle>
          <p className="text-sm text-muted-foreground">
            The account this device is signed in to.
          </p>

          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-sidebar-foreground/5 p-4">
            <Avatar className="size-14 shrink-0">
              <AvatarImage src="/avatars/robert.png" alt="Robert Doe" />
              <AvatarFallback>RD</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Robert Doe</p>
              <p className="truncate text-xs text-muted-foreground">
                rob.doe@brisk.com
              </p>
            </div>
            <Button disabled variant="outline" className="shrink-0 rounded-full">
              Edit profile
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 rounded-2xl bg-sidebar-foreground/5 p-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-xs text-muted-foreground">
                Authentication isn&apos;t wired up in this build.
              </p>
            </div>
            <Button disabled variant="outline" className="shrink-0 rounded-full">
              Sign out
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
