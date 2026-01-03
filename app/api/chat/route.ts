import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, studentName, subjects } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are StudyGenie, a friendly AI study assistant. Student: ${studentName}. Subjects: ${subjects}. Be concise, helpful, and encouraging. Use emojis sparingly.`
        },
        ...messages
      ],
      max_tokens: 800,
      temperature: 0.7,
    })

    const content = response.choices[0].message.content || "Sorry, I couldn't respond."

    return NextResponse.json({ message: content })
  } catch (error) {
    console.error("OpenAI API Error:", error)
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 })
  }
}

