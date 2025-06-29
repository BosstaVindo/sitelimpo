import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // SVG simples para o favicon
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#2563eb"/>
      <path d="M8 12h4v8h-4v-8zm6 0h4v8h-4v-8zm6 0h4v8h-4v-8z" fill="white"/>
    </svg>
  `

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400", // Cache por 1 dia
    },
  })
}
