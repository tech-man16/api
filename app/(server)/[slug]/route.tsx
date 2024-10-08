
import { connect } from "../db/connection";
import { NextRequest, NextResponse } from "next/server";

export function generateStaticParams() {
  return [{ slug: '1' },{slug:"2"}];
}

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const db = await connect();
        const collection = await db.collection("urls");
        const dummyUrl: string = params.slug || "";
        console.log(dummyUrl);

        const data = await collection.findOne({ short_url: dummyUrl });

        if (data != undefined)
            return NextResponse.redirect(data["orig_url"]);
        else
            return NextResponse.redirect(new URL(`${request.nextUrl.origin}/expired`));
        //return NextResponse.json({ message: "Url expired !!", status: 500 }, { status: 500 })

    } catch (e) {
        return NextResponse.json({ message: "Internal Server Error", status: 500 }, { status: 500 })
    }
}

export const dynamic = 'force-static'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
