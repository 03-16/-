import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapData, DifficultyLevel, SearchRequest } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the runtime environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRoadmap = async (request: SearchRequest): Promise<RoadmapData> => {
  const modelId = "gemini-2.5-flash"; 

  let prompt = "";

  if (request.mode === 'book') {
    prompt = `
      请分析书籍 "${request.query}"。
      1. 识别它所属的主要非虚构类领域或流派（例如：“微观经济学”、“斯多葛哲学”、“系统设计”）。请使用中文回答。
      2. 确定这本书在该特定领域中通常被认为是“入门 (Beginner)”、“进阶 (Intermediate)”还是“高阶 (Advanced)”。
      3. 为该领域创建一个包含3个层级的综合学习路线图：
         - 入门/新手 (Beginner)：适合绝对初学者的书籍。
         - 进阶/实践者 (Intermediate)：加深理解的书籍（如果适用，将用户的书放在这里）。
         - 高阶/专家 (Advanced)：用于掌握精通和深入技术/理论细微差别的书籍。
      4. 提供“缺口分析 (Gap Analysis)”：用中文解释如果用户只读了这本书，他们可能会错过该领域的哪些核心概念。
      5. 为每个层级建议 2-3 本独特的高质量书籍，并用中文解释推荐理由。
    `;
  } else {
    prompt = `
      请为主题 "${request.query}" 创建一个学习路线图。
      1. 用中文清晰地定义该领域。
      2. 创建一个包含3个层级的综合学习路线图：
         - 入门/新手 (Beginner)：最佳起点。
         - 进阶/实践者 (Intermediate)：深化知识。
         - 高阶/专家 (Advanced)：精通掌握。
      3. 由于用户未指定当前阅读的书籍，假设他们正在寻找切入点，但希望看到完整的路径。
      4. 用中文提供每个阶段学到的关键概念。
    `;
  }

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      systemInstruction: "你是一位博学的图书馆员和课程设计师。你的目标是帮助读者理解他们在某个领域的所处位置，并用简体中文制定可视化的学习路线图。所有的输出字段（除了JSON键名）都必须是简体中文。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          domain: { type: Type.STRING, description: "研究的广泛类别或领域 (中文)。" },
          summary: { type: Type.STRING, description: "关于该领域涵盖内容的2句中文总结。" },
          userBookAnalysis: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "用户书籍的标准中文标题（如果是主题搜索则为'None'）。" },
              assignedLevel: { 
                type: Type.STRING, 
                enum: [DifficultyLevel.Beginner, DifficultyLevel.Intermediate, DifficultyLevel.Advanced] 
              },
              gapAnalysis: { type: Type.STRING, description: "中文分析：与完整领域相比，这本书没有涵盖什么。" },
              nextSteps: { type: Type.STRING, description: "中文建议：下一步具体的行动项或建议阅读的一本书。" }
            },
            required: ["title", "assignedLevel", "gapAnalysis", "nextSteps"]
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                levelName: { 
                  type: Type.STRING, 
                  enum: [DifficultyLevel.Beginner, DifficultyLevel.Intermediate, DifficultyLevel.Advanced] 
                },
                description: { type: Type.STRING, description: "中文描述：该级别的读者具备什么能力。" },
                keyConcepts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING, description: "该阶段学到的中文关键概念" }
                },
                books: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "中文书名" },
                      author: { type: Type.STRING, description: "作者中文名（或原名）" },
                      reason: { type: Type.STRING, description: "中文理由：为什么这本书对这个级别至关重要？" },
                      isCurrent: { type: Type.BOOLEAN, description: "Set to true ONLY if this matches the user's search query." }
                    },
                    required: ["title", "author", "reason"]
                  }
                }
              },
              required: ["levelName", "description", "keyConcepts", "books"]
            }
          }
        },
        required: ["domain", "summary", "userBookAnalysis", "roadmap"]
      }
    }
  });

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error("Failed to generate roadmap data.");
  }

  try {
    return JSON.parse(jsonText) as RoadmapData;
  } catch (e) {
    console.error("JSON Parsing Error", e);
    throw new Error("The AI response was not valid JSON.");
  }
};