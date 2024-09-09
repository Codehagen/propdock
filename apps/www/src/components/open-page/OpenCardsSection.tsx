import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
import {
  ActivityIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  StarIcon,
} from "lucide-react";

// Static data - replace these with actual data fetched from GitHub if needed
const githubData = {
  stars: 5269,
  openIssues: 43,
  mergedPRs: 366,
  totalContributors: 43,
};

// @ts-ignore
export default function OpenCardSection({ githubData }) {
  return (
    <section className="-mt-10 container flex flex-col items-center">
      <div className="mx-auto grid w-full max-w-4xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Stars</CardTitle>
            <StarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {githubData.stargazers_count}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Open Issues</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{githubData.open_issues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Merged PR&apos;s
            </CardTitle>
            <GitPullRequestIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{githubData.total_count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Forks</CardTitle>
            <GitBranchIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{githubData.forks}</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
