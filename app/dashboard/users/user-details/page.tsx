"use client";
import Component from "./auth0-profile_tabs";

export default function TabsTestPage() {
  const userId = "60e7098d-e537-432f-8e36-488cd0f21bcf";

  return <Component userId={userId} />;
}
