export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobDesc, resumeText } = req.body;

    if (!jobDesc || !resumeText) {
      return res.status(400).json({ error: '직무 설명과 이력서가 필요합니다' });
    }

    // 환경변수에서 API 키 가져오기
   console.log('API Key exists:', !!process.env.CLAUDE_API_KEY);
   const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API 키가 설정되지 않았습니다' });
    }

    const prompt = `당신은 전문 HR 채용 담당자입니다.

직무 설명:
${jobDesc}

지원자 이력서:
${resumeText}

다음 형식으로 정확히 JSON 응답만 제공하세요:
{
  "applicant_name": "지원자 이름",
  "overall_score": 0-100,
  "recommendation": "합격/보류/불합격",
  "required_qualifications": {
    "education": "충족/미충족",
    "experience": "충족/부분충족/미충족",
    "skills": "충족/부분충족/미충족"
  },
  "strengths": ["강점1", "강점2", "강점3"],
  "concerns": ["우려사항1", "우려사항2"],
  "interview_questions": ["질문1", "질문2", "질문3"],
  "detailed_reasoning": "상세 평가 근거"
}

편향 없이 객관적으로 평가하세요.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'API 호출 실패' });
    }

    const data = await response.json();
    const resultText = data.content[0].text;
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return res.status(500).json({ error: 'JSON 파싱 실패' });
    }

    const result = JSON.parse(jsonMatch[0]);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
