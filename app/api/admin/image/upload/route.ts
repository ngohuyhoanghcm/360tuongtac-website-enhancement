/**
 * Image Upload API
 * POST /api/admin/image/upload
 * 
 * Handles image uploads to server
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_API_SECRET || 'secret123'}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File must be an image' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      return NextResponse.json(
        { success: false, message: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `upload-${timestamp}-${randomString}.${extension}`;

    // Determine directory based on form field
    const category = formData.get('category') as string || 'blog';
    const uploadDir = path.join(process.cwd(), 'public', 'images', category);

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    // Return public URL
    const publicUrl = `/images/${category}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('[API] Image upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
