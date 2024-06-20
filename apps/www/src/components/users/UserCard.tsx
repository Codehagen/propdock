import UserCardsSection from "./UserCardsSection";
import { UserMainSection } from "./UserMainSection";

export default function UserCard({ tenantDetails }) {
  return (
    <div>
      <UserCardsSection tenantDetails={tenantDetails} />
      <UserMainSection tenantDetails={tenantDetails} />
    </div>
  );
}
