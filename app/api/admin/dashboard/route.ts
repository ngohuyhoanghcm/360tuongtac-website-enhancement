/**
 * API Route: Dashboard Data
 * GET /api/admin/dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateDashboardData } from '@/lib/admin/monitoring';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET || 'secret123'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

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
