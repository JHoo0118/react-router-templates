import { useTranslation } from "react-i18next";
import type { MetaFunction } from "react-router";
import { convertDateToUserTz } from "~/utils/dates";
import type { Route } from "../../routes/about._index/+types/route";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App About" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const clientLoader = ({ request }: Route.ClientLoaderArgs) => {
  const timezoneDate = convertDateToUserTz(new Date(), request);
  return {
    timezoneDate: timezoneDate.toTimeString(),
  };
};

export default function Index({ loaderData }: Route.ComponentProps) {
  const { timezoneDate } = loaderData;
  const { t } = useTranslation();
  console.log("client", timezoneDate);

  return (
    <div className="placeholder-index relative h-full min-h-screen w-screen dark:bg-gradient-to-b bg-white  dark:from-blue-950 dark:to-blue-900 dark:text-white sm:pb-16 sm:pt-8">
      about
    </div>
  );
}
