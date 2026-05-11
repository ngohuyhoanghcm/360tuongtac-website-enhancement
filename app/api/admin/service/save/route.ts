/**
 * API Route: Save Service
 * POST /api/admin/service/save
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveService, ServiceData } from '@/lib/admin/file-writer';
import { validateService, generateSlug } from '@/lib/admin/validation';
import { generateServiceSEO } from '@/lib/admin/seo-generator';
import { authenticateAdminRequest } from '@/lib/admin/dev-auth-bypass';

export async function POST(request: NextRequest) {
  try {
    // Check authentication (with dev bypass support)
    const authResult = authenticateAdminRequest(request);
    if (authResult) return authResult;

    const body = await request.json();

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.name);

    // Auto-generate meta title and description if not provided
    let metaTitle = body.metaTitle;
    if (!metaTitle || metaTitle.length > 60) {
      // Truncate to 60 chars max, keep it SEO-friendly
      const baseName = body.name || '';
      if (baseName.length <= 45) {
        metaTitle = `${baseName} | 360TuongTac`;
      } else {
        // Truncate name to fit within 60 chars with suffix
        const maxNameLength = 60 - ' | 360TuongTac'.length; // ~46 chars
        metaTitle = `${baseName.substring(0, maxNameLength)}... | 360TuongTac`;
      }
    }
    
    // Auto-generate shortDescription from description if missing or too short
    let shortDescription = body.shortDescription;
    if (!shortDescription || shortDescription.length < 20) {
      // Generate from first 150 chars of description
      shortDescription = body.description?.substring(0, 150).trim() || 'Dịch vụ ' + body.name;
      // Ensure it's within 20-160 chars
      if (shortDescription.length < 20) {
        shortDescription = shortDescription.padEnd(20, '.');
      }
      if (shortDescription.length > 160) {
        shortDescription = shortDescription.substring(0, 157) + '...';
      }
    }
    
    // Auto-generate features if missing
    let features = body.features || [];
    if (!Array.isArray(features) || features.length < 3) {
      features = [
        `Dịch vụ ${body.name || 'chuyên nghiệp'}`,
        'Hỗ trợ 24/7',
        'Đội ngũ giàu kinh nghiệm',
        'Cam kết chất lượng',
        'Giá cả cạnh tranh'
      ].slice(0, 5);
    }
    
    // Auto-generate benefits if missing
    let benefits = body.benefits || [];
    if (!Array.isArray(benefits) || benefits.length < 3) {
      benefits = [
        'Tăng hiệu quả kinh doanh',
        'Tiết kiệm thời gian và chi phí',
        'Nâng cao chất lượng dịch vụ',
        'Mở rộng thị trường',
        'Xây dựng thương hiệu'
      ].slice(0, 5);
    }
    
    // Auto-generate suitableFor if missing
    let suitableFor = body.suitableFor || [];
    if (!Array.isArray(suitableFor) || suitableFor.length < 2) {
      suitableFor = [
        'Doanh nghiệp vừa và nhỏ',
        'Startup và cá nhân kinh doanh',
        'Thương hiệu muốn phát triển online'
      ].slice(0, 3);
    }
    
    // Auto-generate metaDescription - ensure 120-155 chars for SEO
    let metaDescription = body.metaDescription;
    if (!metaDescription || metaDescription.length < 120) {
      // Generate from shortDescription or description
      const source = shortDescription || body.description?.substring(0, 200) || '';
      if (source.length < 120) {
        // Pad with relevant SEO text
        metaDescription = source + ' Dịch vụ chuyên nghiệp từ 360TuongTac - Cam kết chất lượng và hiệu quả.';
      } else {
        metaDescription = source;
      }
      // Ensure within 120-155 chars
      if (metaDescription.length < 120) {
        metaDescription = metaDescription.padEnd(120, '.');
      }
      if (metaDescription.length > 155) {
        metaDescription = metaDescription.substring(0, 152) + '...';
      }
    }

    // Create service data
    const service: ServiceData = {
      id: body.id || `service_${Date.now()}`,
      slug,
      name: body.name,
      shortDescription,
      description: body.description,
      icon: body.icon || 'Sparkles',
      gradient: body.gradient || 'from-blue-500 to-cyan-500',
      price: body.price || 'Liên hệ',
      features,
      benefits,
      suitableFor,
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
