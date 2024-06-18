// components/PropertyList.js
"use client";

import { useRouter } from "next/navigation";

export default function PropertyList({ properties }) {
  const router = useRouter();

  const handlePropertyClick = (propertyId) => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <ul>
      {properties.map((property) => (
        <li
          key={property.id}
          onClick={() => handlePropertyClick(property.id)}
          style={{ cursor: "pointer" }}
        >
          <h3>{property.name}</h3>
          <p>Created at: {new Date(property.createdAt).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}
