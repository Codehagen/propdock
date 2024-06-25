import { DashboardRevenueChart } from "./DasboardRevenueChart";
import DashboardCardsTop from "./DashboardCardsTop";
import { DashboardRentedChart } from "./DashboardRentedChart";
import DashboardTableBestProperties from "./DashboardTableBestProperties";
import DashboardTableLeaseExpiration from "./DashboardTableLeaseExpiration";

export default function DashboardMainDashboard({ properties }) {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 pl-0 pr-0 sm:px-0 sm:py-0 md:gap-8">
      <div className="col-span-full">
        <DashboardCardsTop properties={properties} />
      </div>
      <div className="col-span-full grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
          <DashboardRevenueChart properties={properties} />
          <DashboardTableLeaseExpiration />
        </div>
        <div className="grid auto-rows-max col-span-full items-start gap-4 md:gap-4 xl:col-span-2">
          <DashboardTableBestProperties />
          <DashboardRentedChart />
          {/* Add more blocks as needed */}
        </div>
      </div>
    </main>
  );
}

//ALTERNATIV 2
// "use client";

// import { DashboardRevenueChart } from "./DasboardRevenueChart";
// import DashboardCardsTop from "./DashboardCardsTop";

// export default function DashboardMainDashboard({ properties }) {
//   return (
//     <main className="grid flex-1 items-start gap-4 p-4 pl-0 pr-0 sm:px-0 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
//       <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
//         <DashboardCardsTop properties={properties} />
//         <DashboardRevenueChart properties={properties} />
//         <DashboardRevenueChart properties={properties} />
//       </div>
//       <div>
//         <DashboardRevenueChart properties={properties} />
//         <DashboardRevenueChart properties={properties} />

//         {/* Add more blocks as needed */}
//       </div>
//     </main>
//   );
// }
