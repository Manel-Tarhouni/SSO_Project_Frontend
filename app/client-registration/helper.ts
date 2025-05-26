export function downloadClientCredentials(data: {
  clientId: string;
  clientSecret?: string;
}) {
  const content = {
    clientId: data.clientId,
    ...(data.clientSecret && { clientSecret: data.clientSecret }),
  };

  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "client_credentials.json";
  a.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(
  label: string,
  value: string,
  onCopy?: (label: string) => void
) {
  try {
    await navigator.clipboard.writeText(value);
    if (onCopy) {
      onCopy(label);
    }
  } catch (error) {
    console.error(`Failed to copy ${label}:`, error);
  }
}
