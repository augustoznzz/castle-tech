import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'products.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
}

// GET - Fetch all products
export async function GET() {
  try {
    await ensureDataDir()
    
    if (existsSync(PRODUCTS_FILE_PATH)) {
      const data = await readFile(PRODUCTS_FILE_PATH, 'utf-8')
      const products = JSON.parse(data)
      return NextResponse.json(products)
    }
    
    // Return empty array if no products exist yet
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json([]) // Return empty array on error
  }
}

// POST - Update products (admin only)
export async function POST(request: NextRequest) {
  try {
    const products = await request.json()
    
    // Basic validation
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Invalid products data' }, { status: 400 })
    }
    
    await ensureDataDir()
    await writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2))
    
    return NextResponse.json({ success: true, message: 'Products updated successfully' })
  } catch (error) {
    console.error('Error updating products:', error)
    return NextResponse.json({ error: 'Failed to update products' }, { status: 500 })
  }
}
