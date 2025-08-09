/**
 * Proxy routes to extension API
 * Allows seamless transition between direct Supabase and extension API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getExtensionApiUrl } from '@/lib/config/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params in Next.js 15
    const { path: pathSegments } = await params;
    
    // Construct the path from the dynamic segments
    const path = pathSegments.join('/');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    // Build the full URL to extension API
    const extensionApiUrl = `${getExtensionApiUrl(path)}${queryString ? '?' + queryString : ''}`;
    
    console.log(`Proxying request to: ${extensionApiUrl}`);
    
    // Forward the request to extension API
    const response = await fetch(extensionApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Forward relevant headers from original request
        ...(request.headers.get('user-agent') && { 'User-Agent': request.headers.get('user-agent')! }),
      },
      cache: 'no-store' // Ensure fresh data
    });

    if (!response.ok) {
      console.error(`Extension API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { 
          error: 'Extension API unavailable',
          status: response.status,
          details: process.env.NODE_ENV === 'development' ? response.statusText : undefined
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data with appropriate headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Data-Source': 'extension-api'
      }
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        error: 'Proxy request failed',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
}