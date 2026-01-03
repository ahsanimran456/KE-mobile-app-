import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { subjects, studyHours, goals, examDates } = await req.json()

    if (!subjects || subjects.length === 0) {
      return NextResponse.json({ error: "No subjects provided" }, { status: 400 })
    }

    const prompt = `Create a daily study plan with lecture content for a university student:

Student Info:
- Subjects: ${subjects.join(", ")}
- Available study time: ${studyHours || 3} hours per day
- Goals: ${goals?.join(", ") || "General improvement"}
- Exam dates: ${examDates?.map((e: any) => `${e.subject}: ${e.date}`).join(", ") || "Not specified"}

Generate a JSON array of ${Math.min(Math.floor((studyHours || 3) * 1.2), 6)} study tasks. Each task MUST include:
- title: task name (e.g., "Learn Calculus - Derivatives")
- subject: subject name from the list
- duration: minutes (30, 45, or 60)
- time: start time in HH:MM (24h), starting from 09:00
- priority: "high", "medium", or "low"
- lectureTitle: a catchy lecture title for this topic
- lectureContent: A detailed educational lecture (300-500 words) explaining the topic. Include:
  * Introduction to the concept
  * Key points and explanations
  * Examples where relevant
  * Summary/key takeaways
  * Tips for remembering

Make lectures engaging, easy to understand, and suitable for university students.

Return ONLY valid JSON array:
[{"title":"...", "subject":"...", "duration":45, "time":"09:00", "priority":"high", "lectureTitle":"...", "lectureContent":"..."}]`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator and study planner. Create detailed, engaging lectures that help students understand concepts easily. Return only valid JSON."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    })

    const content = response.choices[0].message.content || "[]"
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    
    if (jsonMatch) {
      const tasks = JSON.parse(jsonMatch[0])
      return NextResponse.json({ tasks })
    } else {
      return NextResponse.json({ error: "Invalid response format" }, { status: 500 })
    }
  } catch (error) {
    console.error("OpenAI API Error:", error)
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 })
  }
}

