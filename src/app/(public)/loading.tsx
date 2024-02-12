import {
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  Card,
} from "~/components/ui/card";
import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 px-3 py-10 sm:px-5">
      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="lg:w-1/2">
            <h2 className="mb-6 text-4xl font-bold text-gray-800">
              Manage Your Society with Ease
            </h2>
            <p className="mb-6 text-gray-600">
              Introducing SocietyEaseHub, the ultimate SaaS platform for
              efficient and seamless management of your residential or corporate
              societies.
            </p>
            <Skeleton className="h-[50px] w-[200px]" />
          </div>
          <div className="lg:w-1/2">
            <Image
              alt="Society Management Illustration"
              className="h-auto w-full"
              height="400"
              src="/favicon.png"
              style={{
                aspectRatio: "600/400",
                objectFit: "cover",
              }}
              width="600"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto mt-20 max-w-6xl" id="features">
        <h3 className="mb-10 text-center text-3xl font-bold text-gray-800">
          Features
        </h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Creating Societies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easily set up and customize your society's structure with a few
                clicks.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Control permissions and access for different members within your
                society.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Invite-Only Membership</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Maintain exclusivity and privacy by inviting members to join
                your society.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Managing Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Keep track of financial transactions and member dues with ease.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Managing Roadmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Plan and visualize future projects and maintenance schedules.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
