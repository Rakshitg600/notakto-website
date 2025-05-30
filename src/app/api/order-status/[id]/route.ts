import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const COINBASE_API_KEY = process.env.COINBASE_API_KEY!;
const COINBASE_API_URL = 'https://api.commerce.coinbase.com/charges';

export async function GET(req: NextRequest) {
  try {
    const chargeId = req.nextUrl.pathname.split('/').pop(); // gets the [id] from URL

    if (!chargeId) {
      return NextResponse.json({ status: 'missing_id' }, { status: 400 });
    }

    const response = await axios.get(`${COINBASE_API_URL}/${chargeId}`, {
      headers: {
        'X-CC-Api-Key': COINBASE_API_KEY,
        'X-CC-Version': '2018-03-22',
      },
    });

    const timeline = response.data.data.timeline;
    const latestStatus = timeline[timeline.length - 1]?.status.toLowerCase();

    return NextResponse.json({ status: latestStatus });
  } catch (error: any) {
    console.error('Error checking payment status:', error.response?.data || error.message);
    return NextResponse.json({ status: 'unknown' }, { status: 500 });
  }
}
