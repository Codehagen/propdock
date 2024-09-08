import UserCardsSection from "./UserCardsSection";
import { UserMainSection } from "./UserMainSection";
import { UserNavTop } from "./UserNavTop";

export default function UserCard({ tenantDetails }) {
  return (
    <div className="space-y-6">
      <UserNavTop tenantDetails={tenantDetails} />
      <UserCardsSection tenantDetails={tenantDetails} />
      <UserMainSection tenantDetails={tenantDetails} />
    </div>
  );
}
