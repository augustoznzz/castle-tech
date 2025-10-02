import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024 // 2GB in bytes
const ALLOWED_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream', // For .zip files
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'application/json',
  'application/xml',
  'text/xml',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

// Generate unique filename
function generateFilename(originalName: string): string {
  const safeName = originalName || 'unknown_file'
  const ext = path.extname(safeName)
  const baseName = path.basename(safeName, ext)
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_')
  const uuid = uuidv4()
  return `${sanitizedBaseName}_${uuid}${ext}`
}

// Format file size for display
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const description = formData.get('description') as string
    const isStock = formData.get('isStock') === 'true'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    // Validate file properties
    if (!file.name || !file.size || !file.type) {
      return NextResponse.json({ error: 'Invalid file properties' }, { status: 400 })
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}` 
      }, { status: 400 })
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
      }, { status: 400 })
    }
    
    // Generate unique filename
    const filename = generateFilename(file.name)
    const filePath = path.join(UPLOAD_DIR, filename)
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)
    
    // Create document object
    const document = {
      id: uuidv4(),
      name: file.name,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: `/uploads/${filename}`,
      uploadedAt: new Date().toISOString(),
      description: description || '',
      isStock: isStock || false
    }
    
    return NextResponse.json({ 
      success: true, 
      document,
      message: 'File uploaded successfully' 
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload file' 
    }, { status: 500 })
  }
}

// GET - List uploaded files for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    // This would typically fetch from a database
    // For now, return empty array as files are managed through product documents
    return NextResponse.json({ documents: [] })
    
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}
