const fs = require('fs');

const original = fs.readFileSync('original.ts', 'utf8');

function extractBlock(key) {
  const dictStartIdx = original.indexOf('export const BACKEND_WORKFLOWS');
  const dictContent = original.slice(dictStartIdx);
  const chunks = dictContent.split(/\/\/ ─────────────────────────────────────────────────────────────/g);
  for (let chunk of chunks) {
    chunk = chunk.trim();
    const match = chunk.match(/^([a-zA-Z0-9_-]+|'[^']+'|"[^"]+"):\s*\{/);
    if (match) {
      let k = match[1].replace(/['"]/g, '');
      if (k === key) {
        let block = chunk;
        if (block.endsWith(',')) block = block.slice(0, -1);
        block = block.substring(match[0].length - 1);
        return block;
      }
    }
  }
  return null;
}

const authBlock = extractBlock('auth');
if (!authBlock) throw new Error('auth block not found');

let content = "import { WorkflowTopicData } from '../../types';\n\nexport const authWorkflow: WorkflowTopicData = " + authBlock + ";\n";

const djangoCode = "      },\n" +
"      django: {\n" +
"        framework: 'django',\n" +
"        frameworkName: 'Django (SimpleJWT)',\n" +
"        language: 'python',\n" +
"        fileLabel: 'myapp/views.py',\n" +
"        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',\n" +
"        code: `from rest_framework.permissions import IsAuthenticated\n" +
"from rest_framework.views import APIView\n" +
"from rest_framework.response import Response\n" +
"\n" +
"class ProtectedProfileView(APIView):\n" +
"    # Enforces JWT authentication middleware globally for this view\n" +
"    permission_classes = [IsAuthenticated]\n" +
"\n" +
"    def get(self, request):\n" +
"        # request.user is automatically populated by SimpleJWT\n" +
"        return Response({\"message\": f\"Welcome {request.user.username}\"})`,\n" +
"        explanation: 'Django REST Framework uses SimpleJWT to parse the Bearer token and populate request.user.',\n" +
"        architectureHighlights: [\n" +
"          'Automatic integration with Django User Model',\n" +
"          'Token lifecycle management via simplejwt views',\n" +
"          'Declarative permission_classes for AuthZ'\n" +
"        ]\n" +
"      }\n" +
"    },\n" +
"    comparisonPoints: [";

content = content.replace(/\n      }\n    \},\n    comparisonPoints: \[/g, "\n" + djangoCode);

fs.writeFileSync('src/data/workflows/auth.ts', content);
console.log('Restored auth.ts securely.');
