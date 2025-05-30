import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const COINBASE_API_KEY = process.env.COINBASE_API_KEY!;
const COINBASE_API_URL = 'https://api.commerce.coinbase.com/charges';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, customerId, customerName } = body;

    const response = await axios.post(
      COINBASE_API_URL,
      {
        name: 'Test Payment',
        description: 'Testing crypto payments',
        pricing_type: 'fixed_price',
        local_price: { amount, currency },
        metadata: { customer_id: customerId, customer_name: customerName },
      },
      {
        headers: {
          'X-CC-Api-Key': COINBASE_API_KEY,
          'X-CC-Version': '2018-03-22',
          'Content-Type': 'application/json',
        },
      }
    );

    const chargeId = response.data.data.id;
    const paymentUrl = response.data.data.hosted_url;

    return NextResponse.json({ success: true, chargeId, paymentUrl });
  } catch (error: any) {
    console.error('Error creating payment:', error.response?.data || error.message);
    return NextResponse.json({ success: false, error: 'Payment creation failed' }, { status: 500 });
  }
}
