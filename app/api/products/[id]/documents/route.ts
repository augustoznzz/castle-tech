import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { Product, ProductDocument } from '@/lib/mock-data'

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'products.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
}

// Load products from file
async function loadProducts(): Promise<Product[]> {
  try {
    if (existsSync(PRODUCTS_FILE_PATH)) {
      const data = await readFile(PRODUCTS_FILE_PATH, 'utf-8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error loading products:', error)
    return []
  }
}

// Save products to file
async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDir()
  await writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2))
}

// GET - Get documents for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const products = await loadProducts()
    const product = products.find(p => p.id === params.id)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ documents: product.documents || [] })
    
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

// POST - Add document to product
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document: ProductDocument = await request.json()
    const products = await loadProducts()
    const productIndex = products.findIndex(p => p.id === params.id)
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Add document to product
    if (!products[productIndex].documents) {
      products[productIndex].documents = []
    }
    
    products[productIndex].documents!.push(document)
    
    await saveProducts(products)
    
    return NextResponse.json({ 
      success: true, 
      document,
      message: 'Document added successfully' 
    })
    
  } catch (error) {
    console.error('Error adding document:', error)
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 })
  }
}

// PUT - Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { documentId, updates } = await request.json()
    const products = await loadProducts()
    const productIndex = products.findIndex(p => p.id === params.id)
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    const product = products[productIndex]
    if (!product.documents) {
      return NextResponse.json({ error: 'No documents found' }, { status: 404 })
    }
    
    const documentIndex = product.documents.findIndex(d => d.id === documentId)
    if (documentIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    
    // Update document
    product.documents[documentIndex] = {
      ...product.documents[documentIndex],
      ...updates
    }
    
    await saveProducts(products)
    
    return NextResponse.json({ 
      success: true, 
      document: product.documents[documentIndex],
      message: 'Document updated successfully' 
    })
    
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}

// DELETE - Remove document from product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }
    
    const products = await loadProducts()
    const productIndex = products.findIndex(p => p.id === params.id)
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    const product = products[productIndex]
    if (!product.documents) {
      return NextResponse.json({ error: 'No documents found' }, { status: 404 })
    }
    
    const documentIndex = product.documents.findIndex(d => d.id === documentId)
    if (documentIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    
    // Remove document
    product.documents.splice(documentIndex, 1)
    
    await saveProducts(products)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Document removed successfully' 
    })
    
  } catch (error) {
    console.error('Error removing document:', error)
    return NextResponse.json({ error: 'Failed to remove document' }, { status: 500 })
  }
}
