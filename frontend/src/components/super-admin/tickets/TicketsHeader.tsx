"use client";

import React from "react";

export default function TicketsHeader() {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-primary">
        Support Tickets
      </h1>
      <p className="text-sm text-muted">
        Manage customer support records, technical incidents, and requests.
      </p>
    </div>
  );
}