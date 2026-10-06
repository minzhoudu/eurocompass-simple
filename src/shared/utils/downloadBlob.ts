// Saves a Blob as a file by clicking a temporary link (works on desktop,
// Android and iOS Safari, unlike navigating to the URL).
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Give the browser a moment to start the download before freeing the file.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};
