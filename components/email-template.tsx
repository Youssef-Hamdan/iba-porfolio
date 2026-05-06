import * as React from "react";

export interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: "#282561",
        lineHeight: 1.5,
        maxWidth: "480px",
        padding: "24px",
      }}
    >
      <h1 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 12px" }}>
        Welcome, {firstName}!
      </h1>
      <p style={{ margin: 0, fontSize: "15px", color: "rgba(40, 37, 97, 0.78)" }}>
        This message was sent from your IBA portfolio using Resend and a React email
        template.
      </p>
    </div>
  );
}
