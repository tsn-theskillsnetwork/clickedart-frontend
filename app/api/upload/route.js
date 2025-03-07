import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing file info" }, { status: 400 });
    }

    const params = {
      Bucket: "clickedart-bucket",
      Key: `images/${Date.now()}-${fileName}`,
      ContentType: fileType,
    };

    const signedUrl = await getSignedUrl(s3, new PutObjectCommand(params), { expiresIn: 300 });
    console.log("Generated Signed URL:", signedUrl);

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate signed URL", details: error.message }, { status: 500 });
  }
}
