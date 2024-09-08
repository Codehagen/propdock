"use client";

import { cn } from "@/lib/utils";

import { AnimatedList } from "./animated-list";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: "Analyse ferdig",
    description: "Eiendom-123",
    time: "15m siden",
    icon: "📊",
    color: "#00C9A7"
  },
  {
    name: "Følg opp leietaker",
    description: "Eiendom-867",
    time: "10m siden",
    icon: "👤",
    color: "#FFB800"
  },
  {
    name: "Ny melding",
    description: "Eiendom-456",
    time: "5m siden",
    icon: "💬",
    color: "#FF3D71"
  },
  {
    name: "Leiekontrakt utløper",
    description: "Eiendom-789",
    time: "2m siden",
    icon: "📅",
    color: "#1E86FF"
  }
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre font-medium text-lg dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-gray-500 text-xs">{time}</span>
          </figcaption>
          <p className="font-normal text-sm dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedListLanding({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex max-h-[400px] min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden rounded-lg border bg-background p-6 shadow-lg",
        className
      )}
    >
      <AnimatedList delay={3000}>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
