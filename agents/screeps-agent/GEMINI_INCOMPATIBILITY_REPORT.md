# Gemini 接口不兼容问题

## 问题

Gemini agent 无法进行多轮对话，每次工具调用后都报 400 错误：

```
Unknown name "id" at 'contents[1].parts[0].function_call': Cannot find field.
Unknown name "id" at 'contents[2].parts[0].function_response': Cannot find field.
```

## 根因

**迁讯代理的 Google 原生 API 不支持 `FunctionCall.id` 和 `FunctionResponse.id` 字段。**

### 验证测试

**测试 1: 带 id 字段（报错）**
```bash
curl -s "https://openai.app.msh.team/raw/x/v1beta/models/gemini-3-pro-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "What is 1+1?"}]},
      {"role": "model", "parts": [{"functionCall": {"id": "call_123", "name": "calc", "args": {}}}]},
      {"role": "user", "parts": [{"functionResponse": {"id": "call_123", "name": "calc", "response": {"output": "2"}}}]}
    ]
  }'
```

**返回：**
```json
{
  "error": {
    "code": 400,
    "message": "Invalid JSON payload received. Unknown name \"id\" at 'contents[1].parts[0].function_call': Cannot find field.\nInvalid JSON payload received. Unknown name \"id\" at 'contents[2].parts[0].function_response': Cannot find field.",
    "type": "upstream_error"
  }
}
```

**测试 2: 不带 id 字段（正常）**
```bash
curl -s "https://openai.app.msh.team/raw/x/v1beta/models/gemini-3-pro-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "What is 1+1?"}]},
      {"role": "model", "parts": [{"functionCall": {"name": "calc", "args": {}}}]},
      {"role": "user", "parts": [{"functionResponse": {"name": "calc", "response": {"output": "2"}}}]}
    ]
  }'
```

**返回：** 正常的模型响应（需等待推理完成）

### 为什么其他模型没问题？

| 模型 | Provider 类型 | API 格式 | 是否有问题 |
|------|--------------|----------|-----------|
| kimi | `kimi` | OpenAI 兼容 | ✅ 正常 |
| gpt | `openai_responses` | OpenAI 原生 | ✅ 正常 |
| claude | `anthropic` | Anthropic 原生 | ✅ 正常 |
| gemini | `google_genai` | **Google 原生** | ❌ **报错** |

**关键区别**：只有 `google_genai` provider 使用 Google 原生 API 格式，会在历史消息中包含 `id` 字段。

### 对话流程

```
第一轮请求: [user prompt] → ✅ 成功，Gemini 返回 function_call
工具执行: Shell 命令 → ✅ 成功
第二轮请求: [user, assistant+function_call, tool_result] → ❌ 400 错误
                              ↑                    ↑
                           含 id 字段           含 id 字段
```

LLM API 是无状态的，每次请求必须发送完整历史。Kosong 在转换历史消息时保留了 `id` 字段，而迁讯代理不认识这个字段。

## 解决方案

修改 Kosong 的 `google_genai.py`，移除 `id` 字段：

**文件**: `kosong/contrib/chat_provider/google_genai.py`

```python
# 行 627-631: 移除 FunctionCall 的 id
function_call = FunctionCall(
    # id=tool_call.id,  # 删除此行
    name=tool_call.function.name,
    args=args,
)

# 行 451-458: 移除 FunctionResponse 的 id  
function_response = FunctionResponse(
    # id=message.tool_call_id,  # 删除此行
    name=...,
    response=...,
)
```

## 配置参考

```toml
# ~/.kimi/config.toml
[models.gemini-3-pro]
provider = "qianxun-google"
model = "gemini-3-pro-preview"

[providers.qianxun-google]
type = "google_genai"  # ← 使用 Google 原生 API
base_url = "https://openai.app.msh.team/raw/x/"
```
