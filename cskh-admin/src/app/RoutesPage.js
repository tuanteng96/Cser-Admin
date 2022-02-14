import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerCare from "../features/CustomerCare";

export default function RoutesPage() {
  return (
    <Routes>
      <Route path="*" element={<CustomerCare />} />
    </Routes>
  );
}
