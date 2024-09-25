"use server";
import Mux from "@mux/mux-node";

// reads MUX_TOKEN_ID and MUX_TOKEN_SECRET from your environment
const mux = new Mux({
  tokenId: process.env.NEXT_PUBLIC_MUX_TOKEN_ID,
  tokenSecret: process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET,
});

export const createUpload = async () => {
  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        encoding_tier: "baseline",
      },
      // in production, you'll want to change this origin to your-domain.com
      // cors_origin: "*",
      cors_origin: "https://candlepaths.com",
    });
    return upload;
  } catch (err) {
    console.log(err);
  }
};

const waitForThreeSeconds = () =>
  new Promise((resolve) => setTimeout(resolve, 3000));

export const redirectToAsset = async (uploadId: string) => {
  let attempts = 0;
  while (attempts <= 10) {
    const upload = await mux.video.uploads.retrieve(uploadId);
    if (upload.asset_id) {
      console.log(upload.asset_id);

      const asset = await mux.video.assets.retrieve(upload.asset_id);
      try {
        if (asset.status === "ready") {
          const playbackIds = asset.playback_ids;
          if (Array.isArray(playbackIds)) {
            const playbackId = playbackIds.find((id) => id.policy === "public");
            if (playbackId) return playbackId.id;
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      await waitForThreeSeconds();
      attempts++;
    }
  }
  throw new Error("No asset_id found for upload");
};
