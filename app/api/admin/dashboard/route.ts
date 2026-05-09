/**
 * API Route: Dashboard Data
 * GET /api/admin/dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateDashboardData } from '@/lib/admin/monitoring';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

export async function GET(request: NextRequest) {
  try {
    // Check authentication (with dev bypass support)
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    // Generate dashboard data from monitoring system
    const dashboardData = generateDashboardData();

    return NextResponse.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error generating dashboard data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
