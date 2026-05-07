/**
 * API Route: Save Service
 * POST /api/admin/service/save
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveService, ServiceData } from '@/lib/admin/file-writer';
import { validateService, generateSlug } from '@/lib/admin/validation';
import { generateServiceSEO } from '@/lib/admin/seo-generator';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET || 'secret123'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.name);

    // Auto-generate meta title and description if not provided
    const metaTitle = body.metaTitle || `${body.name} | Dịch vụ - 360TuongTac`;
    const metaDescription = body.metaDescription || body.shortDescription;

    // Create service data
    const service: ServiceData = {
      id: body.id || `service_${Date.now()}`,
      slug,
      name: body.name,
      shortDescription: body.shortDescription,
      description: body.description,
      icon: body.icon || 'Sparkles',
      gradient: body.gradient || 'from-blue-500 to-cyan-500',
      price: body.price || 'Liên hệ',
      features: body.features || [],
      benefits: body.benefits || [],
      suitableFor: body.suitableFor || [],
      metaTitle,
      metaDescription
    };

    // Validate
    const validation = validateService(service);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validation.errors,
          warnings: validation.warnings
        },
        { status: 400 }
      );
    }

    // Save file
    const result = await saveService(service);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    // Generate SEO data
    const seoData = generateServiceSEO(service);

    return NextResponse.json({
      success: true,
      message: result.message,
      slug: service.slug,
      seoScore: validation.seoScore,
      seoData,
      validation: {
        warnings: validation.warnings
      }
    });
  } catch (error) {
    console.error('Error saving service:', error);
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
