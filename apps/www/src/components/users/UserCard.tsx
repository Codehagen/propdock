import UserCardsSection from "./UserCardsSection";
import { UserMainSection } from "./UserMainSection";
import { UserNavTop } from "./UserNavTop";

export default function UserCard({ tenantDetails }) {
  return (
    <div>
      <UserNavTop tenantDetails={tenantDetails} />
      <UserCardsSection tenantDetails={tenantDetails} />
      <UserMainSection tenantDetails={tenantDetails} />
    </div>
  );
}
