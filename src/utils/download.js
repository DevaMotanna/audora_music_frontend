import api from "../api/axios";

/**
 * Downloads a track through the authenticated API (Authorization header,
 * via the axios interceptor) instead of window.open-ing a URL with the
 * token attached as a query string. The backend proxy-streams the audio
 * with a Content-Disposition header, but we also set the filename
 * client-side so it works regardless.
 */
export const downloadTrackFile = async (track) => {
  const res = await api.get(`/tracks/${track._id}/download`, {
    responseType: "blob",
  });

  const filename = `${track.title} - ${track.artist}.mp3`.replace(/[^a-z0-9 \-_.]/gi, "_").trim();

  const blobUrl = window.URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};
